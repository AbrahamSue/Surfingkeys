function createClipboard() {
    var self = {};

    var holder = document.createElement('textarea');
    holder.contentEditable = true;
    holder.enableAutoFocus = true;
    holder.id = 'sk_clipboard';

    function clipboardActionWithSelectionPreserved(cb) {
        actionWithSelectionPreserved(function(selection) {
            // avoid editable body
            document.documentElement.appendChild(holder);

            cb(selection);

            holder.remove();
        });
    }

    self.m_banner_time = 500;
    self.setBannerTime = function(ms) { this.m_banner_time = ms; };
    self.read = function(onReady) {
        clipboardActionWithSelectionPreserved(function() {
            holder.value = '';
            setSanitizedContent(holder, '');
            holder.focus();
            document.execCommand("Paste");
        });
        var data = holder.value;
        if (data === "") {
            data = holder.innerHTML.replace(/<br>/gi,"\n");
        }
        onReady({data: data});
    };

    self.write = function(text, ms=500) {
        Normal.insertJS(function() {
            window.oncopy = document.oncopy;
            document.oncopy = null;
        }, function() {
            clipboardActionWithSelectionPreserved(function() {
                holder.value = text;
                holder.select();
                document.execCommand('copy');
                holder.value = '';
            });
            Normal.insertJS(function() {
                document.oncopy = window.oncopy;
                delete window.oncopy;
            });
            Front.showBanner("Copied: " + text, ms);
        });
    };

    self.clear = function(ms=500) {
        clipboardActionWithSelectionPreserved(function() {
            holder.value = '';
            holder.select();
            document.execCommand('copy');
            holder.value = '';
        });
        Front.showBanner("Clipboard cleared", ms);
    };
    
    return self;

}
