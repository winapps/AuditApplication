/// <reference group="Dedicated Worker" />

onmessage = function (event) {

}

// Takes a photo using the default JPEG format.
function takepicture() {
    var captureUI = new Windows.Media.Capture.CameraCaptureUI();
    captureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (capturedItem) {
        if (capturedItem) {
            //document.getElementById("message").innerHTML = "User captured a photo."
            document.getElementById('imgCapture').src
                    = window.URL.createObjectURL(data);            
            storeimage(capturedItem);
        }
        else {
            //document.getElementById("message").innerHTML = "User didn't capture a photo."
            var md = Windows.UI.Popups.MessageDialog("Image not Captured");
            md.showAsync();
        }    });
}

WinJS.Application.onerror = function (info) {
    var err = {
        errorMessage: info.detail.errorMessage,
        errorUrl: info.detail.errorUrl,
        errorLine: info.detail.errorLine,
        errorCharacter: info.detail.errorCharacter,
    };

    Windows.Storage.ApplicationData.current.localFolder
       .createFileAsync("crash.txt", Windows.Storage.CreationCollisionOption.openIfExists)
       .then(function (file) {
           Windows.Storage.FileIO.appendLinesAsync(file, [JSON.stringify(err)]);
       });
};

function submit() {

   // savedata();

    var wellsitename = document.getElementById("wellsitename").value;
    var operator = document.getElementById("operator").value;
    var serialnumber = document.getElementById("serialnumber").value;
    var inspectors = document.getElementById("inspectors").value;
    var state = document.getElementById("state").value;
    var country = document.getElementById("country").value;
    var weather = document.getElementById("weather").value;

    var path = document.getElementById("imgCapture").src;
    var file = MyGlobals.imageBlob;

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;


    //var imgBlob = localSettings.values["imgCapture"];

    var applicationData = Windows.Storage.ApplicationData.current;
    var localFolder = applicationData.localFolder;
    localFolder.getFileAsync("AuditImage.jpg")
        .then(function (file) 
        {
           
   // var pictureLibrary = Windows.Storage.KnownFolders.picturesLibrary;
   // pictureLibrary.getFileAsync(imgBlob).done(function (file) {
        if (file) {
 
            file.openAsync(Windows.Storage.FileAccessMode.read).done(function (stream) {

               
                
                // The blob takes ownership of stream and manages lifetime. The stream will be closed when the blob is closed.
                var blob = MSApp.createBlobFromRandomAccessStream(file.contentType, stream);
               
                // upload image
                var fdata = new FormData();
                fdata.append('wellsitename', wellsitename);
                fdata.append('operator', operator);
                fdata.append('serialnumber', serialnumber);
                fdata.append('inspectors', inspectors);
                fdata.append('state', state);
                fdata.append('country', country);
                fdata.append('weather', weather);
                fdata.append('test', blob);
                WinJS.xhr({
                    type: "POST",
                    url: "http://183.82.45.39:9887/AuditService.svc/UploadFile/test.jpg",
                    data: fdata
                   
                }).done(function (result) {
                    console.log(result.responseText)
                    var md = Windows.UI.Popups.MessageDialog(result.responseText);
                    md.showAsync();
                });

               
                blob.msClose(); 
            });
        }
    });
}
   

function pickImage() {
    // Create the picker object and set options
    var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
    // Users expect to have a filtered view of their folders depending on the scenario.
    // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
    openPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);

    // Open the picker for the user to pick a file
    openPicker.pickSingleFileAsync().then(function (file) {
        if (file) {
            // Application now has read/write access to the picked file
            WinJS.log && WinJS.log("Picked photo: " + file.name, "sample", "status");
            //MyGlobals.imageBlob = file;
            
            
            storeimage(file);
            
            document.getElementById('imgCapture').src = window.URL.createObjectURL(file);
            
            
        } else {
            // The picker was dismissed with no selected file
            WinJS.log && WinJS.log("Operation cancelled.", "sample", "status");
        }
    });
}


function savedata() {

    var wellsitename = document.getElementById("wellsitename").value;
    var operator = document.getElementById("operator").value;
    var serialnumber = document.getElementById("serialnumber").value;
    var inspectors = document.getElementById("inspectors").value;
    var state = document.getElementById("state").value;
    var country = document.getElementById("country").value;
    var weather = document.getElementById("weather").value;


    
    //var file = MyGlobals.imageBlob;
    //var path = file.name;

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;
    localSettings.values["wellsitename"] = wellsitename;
    localSettings.values["operator"] = operator;
    localSettings.values["serialnumber"] = serialnumber;
    localSettings.values["inspectors"] = inspectors;
    localSettings.values["state"] = state;
    localSettings.values["country"] = country;
    localSettings.values["weather"] = weather;
    localSettings.values["imgCapture"] = "AuditImage";

    var md = Windows.UI.Popups.MessageDialog("Saved Successfully");
    md.showAsync();

}

function storeimage(content)
{
            var applicationData = Windows.Storage.ApplicationData.current;
            var localFolder = applicationData.localFolder;
            localFolder.createFileAsync("AuditImage.jpg", Windows.Storage.CreationCollisionOption.replaceExisting)
                        .then(function (file) {                            
                            content.copyAndReplaceAsync(file);
                        });     
}

function getimage()
{
    var applicationData = Windows.Storage.ApplicationData.current;
    var localFolder = applicationData.localFolder;
    localFolder.getFileAsync("AuditImage.jpg")
        .then(function (file) {
            Windows.Storage.FileIO.readTextAsync(file);
        });
        
}

function filldata() {
    //var fData = window.localStorage.getItem('formData');
    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    var wellsitename = localSettings.values["wellsitename"];
    var op = localSettings.values["operator"];
    var sn = localSettings.values["serialnumber"];
    var insp = localSettings.values["inspectors"];
    var state = localSettings.values["state"];
    var country = localSettings.values["country"];
    var wther = localSettings.values["weather"];
    var value = localSettings.values["i1"];
    var imgBlob = localSettings.values["imgCapture"];

    
/*    var pictureLibrary = Windows.Storage.KnownFolders.picturesLibrary;
    pictureLibrary.getFileAsync(imgBlob).done(function (file) {
        if (file) {
            var name = file.name;
            document.getElementById('imgCapture').src = window.URL.createObjectURL(file);
            MyGlobals.imageBlob = file;
        }
    });
*/

    var applicationData = Windows.Storage.ApplicationData.current;
    var localFolder = applicationData.localFolder;
    localFolder.getFileAsync("AuditImage.jpg")
        .then(function (file) {
            var name = file.name;
            document.getElementById('imgCapture').src = window.URL.createObjectURL(file);
        });

    document.getElementById("wellsitename").value = wellsitename;
    document.getElementById("operator").value = op;
    document.getElementById("serialnumber").value = sn;
    document.getElementById("inspectors").value = insp;
    document.getElementById("state").value = state;
    document.getElementById("country").value = country;
    document.getElementById("weather").value = wther;


}