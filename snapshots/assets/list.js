
var WEB_ROOT = "https://snapshots.mitmproxy.org"
var BUCKET_URL = 'https://s3-us-west-2.amazonaws.com/snapshots.mitmproxy.org';
var EXCLUDE = {
    "index.html": true,
    "error.html": true,
    "list.js": true,
}


if (typeof S3B_ROOT_DIR == 'undefined') {
    var S3B_ROOT_DIR = '';
}

if (typeof S3B_SORT == 'undefined') {
    var S3B_SORT = 'DEFAULT';
}

jQuery(function ($) { getS3Data(); });

// This will sort your file listing by most recently modified.
// Flip the comparator to '>' if you want oldest files first.
function sortFunction(a, b) {
    switch (S3B_SORT) {
        case "OLD2NEW":
            return a.LastModified > b.LastModified ? 1 : -1;
        case "NEW2OLD":
            return a.LastModified < b.LastModified ? 1 : -1;
        case "A2Z":
            return a.Key < b.Key ? 1 : -1;
        case "Z2A":
            return a.Key > b.Key ? 1 : -1;
        case "BIG2SMALL":
            return a.Size < b.Size ? 1 : -1;
        case "SMALL2BIG":
            return a.Size > b.Size ? 1 : -1;
    }
}
function getS3Data(marker, html) {
    var s3_rest_url = createS3QueryUrl(marker);
    // set loading notice
    $('#listing')
        .html('<img src="//assets.okfn.org/images/icons/ajaxload-circle.gif" />');
    $.get(s3_rest_url)
        .done(function (data) {
            // clear loading notice
            $('#listing').html('');
            var xml = $(data);
            var info = getInfoFromS3Data(xml);

            // Slight modification by FuzzBall03
            // This will sort your file listing based on var S3B_SORT
            // See url for example:
            // http://esp-link.s3-website-us-east-1.amazonaws.com/
            if (S3B_SORT != 'DEFAULT') {
                var sortedFiles = info.files;
                sortedFiles.sort(sortFunction);
                info.files = sortedFiles;
            }

            html = typeof html !== 'undefined' ? html + prepareTable(info) :
                prepareTable(info);
            if (info.nextMarker != "null") {
                getS3Data(info.nextMarker, html);
            } else {
                document.getElementById('listing').innerHTML =
                    '<pre>' + html + '</pre>';
            }
        })
        .fail(function (error) {
            console.error(error);
            $('#listing').html('<strong>Error: ' + error + '</strong>');
        });
}

function buildNavigation(info) {
    var root = '<a href="?prefix=">' + WEB_ROOT + '</a> / ';
    if (info.prefix) {
        var processedPathSegments = '';
        var content = $.map(info.prefix.split('/'), function (pathSegment) {
            processedPathSegments =
                processedPathSegments + encodeURIComponent(pathSegment) + '/';
            return '<a href="?prefix=' + processedPathSegments + '">' + pathSegment +
                '</a>';
        });
        $('#navigation').html(root + content.join(' / '));
    } else {
        $('#navigation').html(root);
    }
}

function createS3QueryUrl(marker) {
    var s3_rest_url = BUCKET_URL;
    s3_rest_url += '?delimiter=/';

    //
    // Handling paths and prefixes:
    //
    // 1. S3BL_IGNORE_PATH = false
    // Uses the pathname
    // {bucket}/{path} => prefix = {path}
    //
    // 2. S3BL_IGNORE_PATH = true
    // Uses ?prefix={prefix}
    //
    // Why both? Because we want classic directory style listing in normal
    // buckets but also allow deploying to non-buckets
    //

    var rx = '.*[?&]prefix=' + S3B_ROOT_DIR + '([^&]+)(&.*)?$';
    var prefix = '';
    if (S3BL_IGNORE_PATH == false) {
        var prefix = location.pathname.replace(/^\//, S3B_ROOT_DIR);
    }
    var match = location.search.match(rx);
    if (match) {
        prefix = S3B_ROOT_DIR + match[1];
    } else {
        if (S3BL_IGNORE_PATH) {
            var prefix = S3B_ROOT_DIR;
        }
    }
    if (prefix) {
        // make sure we end in /
        var prefix = prefix.replace(/\/$/, '') + '/';
        s3_rest_url += '&prefix=' + prefix;
    }
    if (marker) {
        s3_rest_url += '&marker=' + marker;
    }
    return s3_rest_url;
}

function getInfoFromS3Data(xml) {
    var files = $.map(xml.find('Contents'), function (item) {
        item = $(item);
        return {
            Key: item.find('Key').text(),
            LastModified: item.find('LastModified').text(),
            Size: bytesToHumanReadable(item.find('Size').text()),
            Type: 'file'
        }
    });
    var directories = $.map(xml.find('CommonPrefixes'), function (item) {
        item = $(item);
        return {
            Key: item.find('Prefix').text(),
            LastModified: '',
            Size: '0',
            Type: 'directory'
        }
    });
    if ($(xml.find('IsTruncated')[0]).text() == 'true') {
        var nextMarker = $(xml.find('NextMarker')[0]).text();
    } else {
        var nextMarker = null;
    }
    return {
        files: files,
        directories: directories,
        prefix: $(xml.find('Prefix')[0]).text(),
        nextMarker: encodeURIComponent(nextMarker)
    }
    // clang-format on
}

// info is object like:
// {
//    files: ..
//    directories: ..
//    prefix: ...
// }
function prepareTable(info) {
    var files = info.directories.concat(info.files), prefix = info.prefix;
    var cols = [45, 30, 15];
    var content = [];
    content.push(padRight('Last Modified', cols[1]) + '  ' +
        padRight('Size', cols[2]) + 'Key \n');
    content.push(new Array(cols[0] + cols[1] + cols[2] + 4).join('-') + '\n');

    // add ../ at the start of the dir listing, unless we are already at root dir
    if (prefix && prefix !== S3B_ROOT_DIR) {
        var up = prefix.replace(/\/$/, '').split('/').slice(0, -1).concat('').join(
            '/'),  // one directory up
            item =
                {
                    Key: up,
                    LastModified: '',
                    Size: '',
                    keyText: '../',
                    href: S3BL_IGNORE_PATH ? '?prefix=' + up : '../'
                },
            row = renderRow(item, cols);
        content.push(row + '\n');
    }

    jQuery.each(files, function (idx, item) {
        // strip off the prefix
        item.keyText = item.Key.substring(prefix.length);
        if (item.Type === 'directory') {
            if (S3BL_IGNORE_PATH) {
                item.href = location.protocol + '//' + location.hostname +
                    location.pathname + '?prefix=' + item.Key;
            } else {
                item.href = item.keyText;
            }
        } else {
            item.href = WEB_ROOT + '/' + encodeURIComponent(item.Key);
            item.href = item.href.replace(/%2F/g, '/');
        }
        var row = renderRow(item, cols);
        if (!EXCLUDE[item.Key]) {
            content.push(row + '\n');
        }
    });

    return content.join('');
}

function renderRow(item, cols) {
    var row = '';
    row += padRight(item.LastModified, cols[1]) + '  ';
    row += padRight(item.Size, cols[2]);
    row += '<a href="' + item.href + '">' + item.keyText + '</a>';
    return row;
}

function padRight(padString, length) {
    var str = padString.slice(0, length - 3);
    if (padString.length > str.length) {
        str += '...';
    }
    while (str.length < length) {
        str = str + ' ';
    }
    return str;
}

function bytesToHumanReadable(sizeInBytes) {
    var i = -1;
    var units = [' kB', ' MB', ' GB'];
    do {
        sizeInBytes = sizeInBytes / 1024;
        i++;
    } while (sizeInBytes > 1024);
    return Math.max(sizeInBytes, 0.1).toFixed(1) + units[i];
}
