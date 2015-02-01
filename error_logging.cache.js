/* dependencies JSON  */
(function(window, document) {
    var BrowserStorage;
    var dataUrl = '../tiny.gif?';
    var currentDomainOnly = true;
    var testAdditionalHandler = function(){
        document.body.innerHTML = 'ERROR IS CATCHED';
    };
    //include json if undefined
    if (typeof(JSON)==='undefined'){
        var jsonScript = document.createElement('script');
        jsonScript = "text/javascript";
        jsonScript.src = "https://cdnjs.cloudflare.com/ajax/libs/json2/20140204/json2.min.js";
        document.getElementsByTagName("head")[0].appendChild(jsonScript);
    }
    // Refer to https://gist.github.com/remy/350433
    try {
        // Test webstorage existence.
        if (!window.localStorage || !window.sessionStorage) throw "exception";
        // Test webstorage accessibility - Needed for Safari private browsing.
        localStorage.setItem('storage_test', 1);
        localStorage.removeItem('storage_test');
        BrowserStorage = localStorage;
    } catch(e) {
        var Storage = function (type) {
            function createCookie(name, value, days) {
                var date, expires;

                if (days) {
                    date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    expires = "; expires="+date.toGMTString();
                } else {
                    expires = "";
                }
                document.cookie = name+"="+value+expires+"; path=/";
            }
            function readCookie(name) {
                var nameEQ = name + "=",
                    ca = document.cookie.split(';'),
                    i, c;

                for (i=0; i < ca.length; i++) {
                    c = ca[i];
                    while (c.charAt(0)==' ') {
                        c = c.substring(1,c.length); 2480
                    }

                    if (c.indexOf(nameEQ) == 0) {
                        return c.substring(nameEQ.length,c.length);
                    }
                }
                return null;
            }
            function setData(data) {
                // Convert data into JSON and encode to accommodate for special characters.
                data = encodeURIComponent(JSON.stringify(data));
                // Create cookie.
                createCookie('localStorage', data, 365);
            }
            function getData() {
                // Get cookie data.
                var data = readCookie('localStorage');
                // If we have some data decode, parse and return it.
                return data ? JSON.parse(decodeURIComponent(data)) : {};
            }
            // Initialise if there's already data.
            var data = getData();

            return {
                length: 0,
                getItem: function (key) {
                    return data[key] === undefined ? null : data[key];
                },
                key: function (i) {
                    // not perfect, but works
                    var ctr = 0;
                    for (var k in data) {
                        if (ctr == i) return k;
                        else ctr++;
                    }
                    return null;
                },
                setItem: function (key, value) {
                    data[key] = value+''; // forces the value to a string
                    this.length++;
                    setData(data);
                }
            };
        };
        // Replace window.localStorage and window.sessionStorage with out custom
        // implementation.
        BrowserStorage = new Storage('local');
    }
    // Object with items of errors
    var allErrorsCount = 0;

    // 'Error item' constructor
    function ErrorLog(fileUrl, message, line, column, fileName) {
        this.message = message;
        this.filename = fileName;
        this.fileurl = fileUrl;
        this.line = line;
        this.column = column;
        this.count = 1;
    }

    /*
     Stateful Map
     state definition
     state 0 = to send
     state 1 = sending
     state 2 = sended
     state allowed transitions
     0 -> 1 -> 2 ->0
     */
    function BlockingTrinityMap(){};
    BlockingTrinityMap.prototype.set = function(key, obj){
        if (this[key])
            this.renewal(key);
        else
            this[key] = {
                state: 0,
                data: obj
            };
    };
    BlockingTrinityMap.prototype.block = function(key){
        if (this[key].state === 0)
        {
            this[key].state = 1;
            return this[key].data;
        }
    };
    BlockingTrinityMap.prototype.release = function(key){
        if (this[key].state === 1)
        {
            this[key].state = 2;
            return this[key].data;
        }
    };
    BlockingTrinityMap.prototype.renewal = function(key){
        if (this[key].state === 2)
        {
            this[key].state = 0;
            return this[key].data;
        }
    };
    BlockingTrinityMap.prototype.get = function(key){
        if (this[key])
            return this[key].data;
    };
    BlockingTrinityMap.prototype.getDataAndBlock = function(){
        var msg = {
            keys: [],
            data: {}
        };
        for (var key in this){
            var data = this.block(key);
            if (data)
            {
                msg.data[key] = data;
                msg.keys.push(key);
            }
        }
        return msg;
    };
    BlockingTrinityMap.prototype.getBlockedData = function(){
        var msg = {};
        for (var key in this){
            if (typeof(this[key].state) != 'undefined' && this[key].state === 1)
                msg[key] = this[key].data;
        }
        return msg;
    };

    var CacheSender = {
        mapData: new BlockingTrinityMap(),
        check: function(){
            try{
                if (BrowserStorage.getItem('errorjs'))
                {
                    var errors = JSON.parse(Storage.getItem('errorjs'));
                    if (!Object.keys(errors).length)
                        return;
                    for (var p in errors)
                        CacheSender.mapData.set(p, errors[p]);
                    var msg = CacheSender.mapData.getDataAndBlock();
                    var jsonData = JSON.stringify(msg.data);
                    console.log('error' + jsonData);
                    var img = new Image();
                    img.src = dataUrl + jsonData;
                    img.onload = function(){
                        for (var i=0; i<msg.keys.length;i++)
                            CacheSender.mapData.release(msg.keys[i]);
                        if (testAdditionalHandler)
                            testAdditionalHandler();
                        BrowserStorage.setItem('errorjs', JSON.stringify(CacheSender.mapData.getBlockedData()));
                    };
                }
            } catch(e){
                console.log('something wrong with parsing');
            }
        },
        send: function(key, data){
            CacheSender.mapData.set(key, data);
            var msg = CacheSender.mapData.getDataAndBlock();
            if (!(msg.keys.length))
                return;
            BrowserStorage.setItem('errorjs', JSON.stringify(CacheSender.mapData.getBlockedData()));
            var jsonData = JSON.stringify(msg.data);
            console.log('error' + jsonData);
            var img = new Image();
            img.src = dataUrl + jsonData;
            img.onload = function(){
                for (var i=0; i<msg.keys.length;i++)
                    CacheSender.mapData.release(msg.keys[i]);
                if (testAdditionalHandler)
                    testAdditionalHandler();
                BrowserStorage.setItem('errorjs', JSON.stringify(CacheSender.mapData.getBlockedData()));
            };
        }
    };
    // Set 'error' handlers
    // IE8-IE10
    if (typeof (window.attachEvent) === 'function')
        window.attachEvent('onerror', errorHandlerOldBrowsers);
        // Modern browsers, except Opera 12.17-
    else
    {
        if (typeof (window.addEventListener) == 'function' && !window.opera)
            window.addEventListener('error', errorHandler, false);
            // Other browsers
        else
            window.onerror = errorHandlerOldBrowsers;
    }

    CacheSender.check();
    // Function-wrap for error handler in old browsers
    function errorHandlerOldBrowsers(){
        var errorMessage = {
            message: arguments[0],
            filename: arguments[1],
            lineno: arguments[2],
            colno: arguments[3] || 0
        };
        errorHandler(errorMessage);
    }
    // Parse error message and create new 'error item'
    function errorHandler(errorMessage) {

        // Filter to avoid logging unnecessary errors
        switch (errorMessage.message) {
            // 'same-origin policy' (http://stackoverflow.com/questions/5913978/cryptic-script-error-reported-in-javascript-in-chrome-and-firefox) and 'AdBlock' errors
            case 'Script error.':
                return;
        }

        // Stop logging if the page occurred more than 20 errors
        if (allErrorsCount > 20)
            return;

        // Get token
        // var token = '';
        // var tokenElement = document.getElementById('token_js');
        // if (tokenElement) token = tokenElement.getAttribute('content');

        // Parse full url to file and get filename
        var fileName = '';
        var regEx = /^http\:\/\/[a-z0-9\.\/-_]+\/([a-z0-9_\.-]+)\.(js|html)/i;
        var fileNameArr = regEx.exec(errorMessage.filename);
        if (fileNameArr)
            fileName = fileNameArr[1] + '.' + fileNameArr[2];
        //only current domain
        if (currentDomainOnly && String.prototype.indexOf && errorMessage.filename.indexOf(window.location.hostname)<0)
            return;

        // Compose unique 'errorID'
        var errorID = fileName + '---' + errorMessage.lineno + '---' + errorMessage.colno;

        // Stop logging if the error continues more than 2 times (e.c. in loops)
        var item = CacheSender.mapData.get(errorID);
        if (item && item.count >= 2)
            return;
        // If the current error has been repeated
        if (item)
            item.count++;
        // If the current error had appeared for the first time
        else
            item = new ErrorLog(errorMessage.filename, errorMessage.message, errorMessage.lineno, errorMessage.colno, fileName);
        allErrorsCount++;
        // Send current error to server
        CacheSender.send(errorID, item);
        // When return true, error alerts (like in older versions of Internet Explorer) will be suppressed
        return true;
    }
})(window, document);