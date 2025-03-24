// Browser detection class
mbrowser = function () {
    this.spec_string = navigator.userAgent;
    this.name = this.get_name();
    this.version = this.get_version();
};

mbrowser.prototype.get_name = function () {
    var spec_string = this.spec_string;
    var matches = spec_string.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    matches = matches[2] ? [matches[1], matches[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if (/trident/i.test(matches[1])) return 'IE';

    if (matches[1] === 'Chrome') {
        if (spec_string.match(/\bOPR|Edge\/(\d+)/)) return 'Opera';
    }

    if ((temp = spec_string.match(/version\/(\d+)/i)) != null) {
        matches.splice(1, 1, temp[1]);
    }

    return matches[0];
};

mbrowser.prototype.get_version = function () {
    var spec_string = this.spec_string;
    var matches = spec_string.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    matches = matches[2] ? [matches[1], matches[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if (/trident/i.test(matches[1])) {
        var temp = /\brv[ :]+(\d+)/g.exec(spec_string) || [];
        return temp[1] || '';
    }

    if (matches[1] === 'Chrome') {
        var temp = spec_string.match(/\bOPR|Edge\/(\d+)/);
        if (temp != null) return temp[1];
    }

    if ((temp = spec_string.match(/version\/(\d+)/i)) != null) {
        matches.splice(1, 1, temp[1]);
    }

    return matches[1];
};

var browser = new mbrowser();
var os = navigator.platform || "Unknown OS";

const screenWidth = screen.width;
const screenHeight = screen.height;
const availableWidth = window.innerWidth;
const availableHeight = window.innerHeight;

const date = new Date();
const formattedDate = new Intl.DateTimeFormat('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
const formattedTime = new Intl.DateTimeFormat('fi-FI', { hour: '2-digit', minute: '2-digit' }).format(date);

const target = document.getElementById('target');
target.innerHTML = `
    <p><strong>Browser:</strong> ${browser.name}</p>
    <p><strong>Version:</strong> ${browser.version}</p>
    <p><strong>Operating System:</strong> ${os}</p>
    <p><strong>Screen Width:</strong> ${screenWidth}px</p>
    <p><strong>Screen Height:</strong> ${screenHeight}px</p>
    <p><strong>Available Browser Space:</strong> ${availableWidth}px x ${availableHeight}px</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Time:</strong> ${formattedTime}</p>
`;
