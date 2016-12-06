function main() {
    function getQueryParams(search) {
        const pairs = (search || '').slice(1).split('&');

        return pairs.reduce((acc, kv) => {
            if (kv !== undefined) {
                const [key, value] = kv.split('=');
                acc[key] = value;
            }

            return acc;
        }, {});
    }

    function reject(message) {
        return Promise.reject(new Error(message));
    }

    function xx(x) {
        return (x >= 0 && x < 10) ? '0' + x : '' + x;
    }

    function nocache() {
        return 'nocache=' + Math.random().toString(16).slice(2);
    }

    function getArticle(yyyymmdd) {
        if (!yyyymmdd) {
            return reject('no ?date= passed');
        }

        const [yyyy, mm, dd] = yyyymmdd.split('-').map(Number).map(xx);
        const date = new Date(+yyyy, +mm, +dd);

        if (isNaN(date.getTime())) {
            return reject('invalid date passed, expected ?date=yyyy-mm-dd');
        }

        return fetch(`content/${yyyy}-${mm}-${dd}.md?${nocache()}`).then(res => res.text())
    }

    function render(articleHTML) {
        document.getElementById('article').innerHTML = articleHTML;
    }

    const remark = new Remarkable();
    const qp = getQueryParams(window.location.search);

    if (qp.hasOwnProperty('date')) {
        getArticle(qp.date)
            .then(md => remark.render(md))
            .then(html => render(html))
            .catch(err => render(err.toString()));
    }
}


console.log(chrome.app);
