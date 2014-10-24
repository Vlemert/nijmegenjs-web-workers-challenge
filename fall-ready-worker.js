var FallReadyWorker = function(options){

    this.say = function(e) {
        if (this.worker) {
            this.worker.postMessage(e);
        } else {
            try {
                var result = options.worker.func(e);
                options.onMessage(result);
            } catch(e) {
                options.onError(e);
            }
        }
    };

    if (Worker) {
        var myWorker = "var func = " + options.worker.func.toString() + "; var getPostData = " + options.worker.getPostData.toString() + "; self.addEventListener('message', function(e) { self.postMessage(getPostData(e))}); self.addEventListener('error', " + options.onError + ");";

        var blob = new Blob([String(myWorker)]),
            blobUrl = window.URL.createObjectURL(blob);

        this.worker = new Worker(blobUrl);

        this.worker.addEventListener('message', options.onMessage);
    }
};