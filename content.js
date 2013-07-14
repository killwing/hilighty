(function() {

if (!/cloud|appspot|google/.test(document.location.href)) {
    return;
}

var escapeRegex = function(re) {
    return re.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
};

var colors = ['red', 'green', 'blue', 'purple', '#E67A00'];
var keywords = ['c++', 'javascript', 'node', 'vim', 'git'];
keywords.forEach(function(word, i) {
    keywords[i] = escapeRegex(word);
});


var isOn = false;

var turnOffHili = function() {
    isOn && findAndReplaceDOMText.revert();
    isOn = false;
    console.log('highlight is off');
};

var turnOnHili = function() {
    turnOffHili(); // turn off first
    findAndReplaceDOMText(new RegExp(keywords.join('|'), 'ig'), document.body, function(fill, matchIndex) {
        var el = document.createElement('span');
        el.style.backgroundColor = colors[matchIndex%colors.length];
        el.innerHTML = fill;
        el.className = 'hilighty';
        return el;
    });
    isOn = true;
    console.log('highlight is on');
};

var toggleHili = function() {
    isOn ? turnOffHili() : turnOnHili();
};

turnOnHili(); // firstly


var observer = new MutationObserver(function(mutations) {
    if (!isOn) { // only update when highlight is on
        return;
    }

    var doHili = true;
    mutations.forEach(function(rec, i) {
        // if any added or removed triggered by last time highlight
        for (var i = 0; i < rec.addedNodes.length; i++) {
            var node = rec.addedNodes[i];
            if (node.nodeType == 1) { // ELEMENT_NODE
                if (node.className == 'hilighty') {
                    doHili = false;
                    break;
                }
            }
        }

        for (var i = 0; i < rec.removedNodes.length; i++) {
            var node = rec.removedNodes[i];
            if (node.nodeType == 1) { // ELEMENT_NODE
                if (node.className == 'hilighty') {
                    doHili = false;
                    break;
                }
            }
        }
    });

    if (doHili) {
        turnOnHili();
    }
});

observer.observe(document.body, { childList: true, subtree: true });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    toggleHili();
    sendResponse({result: isOn ? 'on' : 'off'});
});

})();
