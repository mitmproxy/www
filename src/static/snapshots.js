const WEB_ROOT = "https://snapshots.mitmproxy.org/"
const BUCKET_URL = "https://s3-us-west-2.amazonaws.com/snapshots.mitmproxy.org";
const EXCLUDE = {
    "index.html": true,
    "error.html": true,
    "list.js": true,
}

function sortByName(a, b) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
}

function fetchS3(directory) {
    return fetch(BUCKET_URL + "?delimiter=/&prefix=" + directory)
        .then(function (response) {
            return response.text()
        })
        .then(function (data) {
            let s3 = (new DOMParser()).parseFromString(data, "text/xml");
            console.log(s3);
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
            directories.reverse();  // latest version first


            return { directory: directory, files: files, directories: directories };
        })
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
