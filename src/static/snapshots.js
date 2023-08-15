const WEB_ROOT = "https://downloads.mitmproxy.org/"
const BUCKET_URL = "https://downloads.mitmproxy.org/list";
const EXCLUDE = {
    "index.html": true,
    "error.html": true,
    "list.js": true,
}

function sortByName(a, b) {
    // >>> ["10.0.0","5.0.1","5.0.0","1.0.0","aaa","bbb"].map(x => ({name: x})).sort(sortByName).map(x => x.name)
    // ['10.0.0', '5.0.1', '5.0.0', '1.0.0', 'aaa', 'bbb']
    a = a.name.match(/\d+|\D+/g);
    b = b.name.match(/\d+|\D+/g);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        let aNum = parseInt(a[i]);
        let bNum = parseInt(b[i]);
        if (!isNaN(aNum) && !isNaN(bNum)) {
            if (aNum !== bNum) {
                return bNum - aNum;
            }
        } else if (a[i] > b[i]) {
            return 1
        } else if (a[i] < b[i]) {
            return -1;
        }
    }
    return 0;
}

let s3cache = {};

function fetchS3(directory) {
    let url = BUCKET_URL + "?delimiter=/&prefix=" + directory;
    s3cache[url] = s3cache[url] || (fetch(url)
        .then(function (response) {
            return response.text()
        })
        .then(function (data) {
            let s3 = (new DOMParser()).parseFromString(data, "text/xml");
            let files = [];
            s3.querySelectorAll("Contents").forEach(function (item) {
                if (item.querySelector("Key").textContent in EXCLUDE) {
                    return;
                }
                files.push({
                    name: item.querySelector("Key").textContent.replace(directory, ""),
                    time: new Date(item.querySelector("LastModified").textContent),
                    size: parseInt(item.querySelector("Size").textContent)
                });
            })
            files.sort(sortByName);

            let directories = [];
            s3.querySelectorAll("CommonPrefixes").forEach(function (item) {
                directories.push({
                    name: item.querySelector("Prefix").textContent.replace(directory, ""),
                });
            })
            directories.sort(sortByName);

            return {directory: directory, files: files, directories: directories};
        }));
    return s3cache[url];
}


function getLatestRelease(suffix) {
    return fetchS3("").then(function (data) {
        let latestVersion = data.directories
            .map(function (x) {
                return x.name.replace("/", "")
            })
            .filter(function (x) {
                return /^[\d.]+$/.test(x);
            })[0]
        return WEB_ROOT + latestVersion + "/mitmproxy-" + latestVersion + suffix;
    })
}
