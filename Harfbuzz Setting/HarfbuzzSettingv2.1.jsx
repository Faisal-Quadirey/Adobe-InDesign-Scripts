try {
    // Step 0: Check and Confirm Current Harfbuzz Setting
    // Retrieve the current Harfbuzz setting from the app and display it to the user
    var currentSetting = app.textPreferences.shapeIndicAndLatinWithHarbuzz;
    var changeSetting = confirm("Currently Harfbuzz is: " + (currentSetting ? "Enabled" : "Disabled") + ".\n\nAre you sure you want to modify the Harfbuzz settings?");

    // If the user clicks "Cancel", stop further execution
    if (!changeSetting) {
        alert("No changes made to the Harfbuzz setting.");
    } else {
        // Step 1: Gather User Input
        // Ask the user whether to enable or disable Harfbuzz
        var userSelection = confirm("Harfbuzz for Indic and Latin Scripts? Click Yes for Enable, No for Disable.");

        // Step 2: Save User Selection
        // Store the user's choice in a label within the app
        app.insertLabel("HarfbuzzSetting", userSelection ? "true" : "false");

        // Step 3: Apply the Harfbuzz Setting
        // Retrieve the user's selection and apply it to the Harfbuzz setting
        var setting = app.extractLabel("HarfbuzzSetting");
        var enableHarfbuzz = (setting === "true");
        app.textPreferences.shapeIndicAndLatinWithHarbuzz = enableHarfbuzz;

        // Step 4: Display the Result to the User
        // Show an alert message based on whether Harfbuzz was enabled or disabled
        if (enableHarfbuzz) {
            alert("Harfbuzz was enabled successfully");
        } else {
            alert("Harfbuzz was disabled successfully.");
        }

        // Step 5: Optionally Force Recompose Text Frames by Making a Minor Edit
        // This step will be optional for the user, asking if they want to recompose the text frames.

        var recomposeChoice = confirm("If you want to recompose the text frames, click Yes. Otherwise, click No.");

        if (recomposeChoice) {
            // Ensure there is an active document open
            if (app.documents.length > 0) {
                var doc = app.activeDocument;

                // Loop through all the text frames in the document
                for (var i = 0; i < doc.textFrames.length; i++) {
                    var textFrame = doc.textFrames[i];
                    var contents = textFrame.contents;

                    // Make a minor edit: add a space, then remove it to force recomposition
                    textFrame.contents = contents + " ";
                    textFrame.contents = contents;
                }

                // Notify the user that the recomposition is complete
                alert("All text frames have been recomposed successfully!");
            } else {
                // If no document is open, notify the user
                alert("No active document found.");
            }
        } else {
            // Notify the user that the recomposition process was canceled
            alert("Recompose process canceled. No changes were made.");
        }
    }

} catch (e) {
    // Error Handling
    // If any error occurs during the process, display an alert with the error message
    alert("Error applying setting: " + e.message);
}
