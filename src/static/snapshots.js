const WEB_ROOT = "https://snapshots.mitmproxy.org/"
const BUCKET_URL = "https://s3-us-west-2.amazonaws.com/snapshots.mitmproxy.org";
const EXCLUDE = {
    "index.html": true,
    "error.html": true,
    "list.js": true,
}

function sortByName(a, b) {
    // 5.0 > 4.0 > 1.0 > a > b > z
    let invert = (/^[0-9]/.test(a.name) && /^[0-9]/.test(b.name)) ? -1 : 1;
    if (a.name > b.name) return invert;
    if (a.name < b.name) return -invert;
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

            return { directory: directory, files: files, directories: directories };
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
