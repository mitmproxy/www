if (!window.Promise) {
    document.write(
        '\x3Cscript src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js" integrity="sha384-qJAAVv+GMrM6LcwyNkOCaMOmwxyNnl6bgHDjp5bbtw8iJ6TAvIueZFaPaep9A4WN" crossorigin="anonymous">\x3C/script>'
    )
}
if (!window.fetch) {
    document.write(
        '\x3Cscript src="https://cdn.jsdelivr.net/npm/whatwg-fetch@2.0.3/fetch.min.js" integrity="sha384-hjJDFVtG1y/1g2fSiUAe+ccz4SO/dP/QlEtDDsxqhOIJ7zNBGpnC9V+NGhV7KQKK" crossorigin="anonymous">\x3C/script>'
    )
}
if (!NodeList.prototype.forEach) {
    document.write(
        '\x3Cscript src="https://cdn.jsdelivr.net/npm/mdn-polyfills@5.11.0/NodeList.prototype.forEach.js" integrity="sha384-kBcwD+Q8hPLnLXDHr4sewG9hSJRJjgWtgCN3xfdVQshImuEIc3jGb/9coyDrnbhw" crossorigin="anonymous">\x3C/script>'
    )
}
if (!String.prototype.includes) {
    document.write(
        '\x3Cscript src="https://cdn.jsdelivr.net/npm/mdn-polyfills@5.11.0/String.prototype.includes.js" integrity="sha384-G2ZpOGXqy4yuoxnPMZcJHVa6fJJZPojqPK33DVNC3QA++b4xhcWHDbLoo32NJ7ju" crossorigin="anonymous">\x3C/script>'
    )
}