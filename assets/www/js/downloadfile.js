var downloadfile = {

    fileId: 1,

    download: function(URL, Folder_Name, File_Name) {
        //step to request a file system

        var downloadThis = this;
        window.plugins.toast.showShortBottom('下載檔案中...');
        // navigator.notification.activityStart("Download file...", "loading");

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

        function fileSystemSuccess(fileSystem) {
            var download_link = encodeURI(URL);
            ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

            var directoryEntry = fileSystem.root; // to get root path of directory
            directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
            var rootdir = fileSystem.root;

            var fp = rootdir.toURL(); // Returns Fulpath of local directory
        //    var fp = "file:///storage/sdcard0/"; // Returns Fulpath of local directory

            fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
            // download function call
            filetransfer(download_link, fp);
        }

        function onDirectorySuccess(parent) {
            // Directory created successfuly
        }

        function onDirectoryFail(error) {
            //Error while creating directory
            navigator.notification.activityStop();
            alert("Unable to create new directory: " + error.code);
        }

          function fileSystemFail(evt) {
            //Unable to access file system
            navigator.notification.activityStop();
            alert(evt.target.error.code);
         }

         function filetransfer(download_link, fp) {
            var fileTransfer = new FileTransfer();

            // Settup File Transger Progress
            // fileTransfer.onprogress = function(progressEvent) {
            //     if (progressEvent.lengthComputable) {
            //         var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            //         statusDom.innerHTML = perc + "% loaded...";
            //     } else {
            //         if(statusDom.innerHTML == "") {
            //             statusDom.innerHTML = "Loading";
            //         } else {
            //             statusDom.innerHTML += ".";
            //         }
            //     }
            // };

            // File download function with URL and local path
            fileTransfer.download(download_link, fp,
                    function (entry) {
                      // navigator.notification.activityStop();

                      var fileId = downloadThis.fileId;
                      downloadThis.fileId++;

                      window.plugins.toast.showLongBottom("下載完成至："+fp);
                      
                    // window.plugin.notification.local.promptForPermission();
                    window.plugin.notification.local.add({
                        id:         fileId.toString(),  // A unique id of the notifiction
                        message:    File_Name,  // The message that is displayed
                        title:      "下載完成",  // The title of the message
                        // repeat:     String,  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
                        // badge:      4,  // Displays number badge to notification
                        // sound:      String,  // A sound to be played
                        // json:       String,  // Data to be passed through the notification
                        autoCancel: true, // Setting this flag and the notification is automatically canceled when the user clicks it
                        // ongoing:    Boolean, // Prevent clearing of notification (Android only)
                    });
                    window.plugin.notification.local.onclick = function (id, state, json) {
                        if (id === fileId.toString()) {
                            window.plugins.fileOpener.open(entry.toURL());
                        }
                    };

//                        alert("download complete: " + entry.toURL());
                    },
                 function (error) {
                     //Download abort errors or download failed errors
                     // navigator.notification.activityStop();
                     alert("download error source " + error.source);
                     //alert("download error target " + error.target);
                     //alert("upload error code" + error.code);
                 }
            );
        }
    }

};

