
try {
    // Step 0: Check and Confirm Current Harfbuzz Setting
    // Retrieve the current Harfbuzz setting from the app and display it to the user
    var currentSetting = app.textPreferences.shapeIndicAndLatinWithHarbuzz;
    var changeSetting = confirm("Currently Harfbuzz is: " + (currentSetting ? "Enabled" : "Disabled") + 
                                ".\n\nAre you sure you want to modify the Harfbuzz settings?");

    // If the user clicks "Cancel", exit the script
    if (!changeSetting) {
        alert("No changes made to the Harfbuzz setting.");
        exit();
    }

    // Step 1: Gather User Input
    // Display a confirmation dialog to the user asking whether to enable or disable Harfbuzz
    var userSelection = confirm("Harfbuzz for Indic and Latin Scripts? Click Yes for Enable, No for Disable.");

    // Step 2: Save User Selection
    // Store the user's choice in a label within the app (as a global variable)
    app.insertLabel("HarfbuzzSetting", userSelection ? "true" : "false");

    // Step 3: Apply the Harfbuzz Setting
    // Retrieve the user's selection from the label
    var setting = app.extractLabel("HarfbuzzSetting");
    var enableHarfbuzz = (setting === "true");  // Convert the retrieved value to a boolean
    
    // Apply the Harfbuzz setting based on the user's selection
    app.textPreferences.shapeIndicAndLatinWithHarbuzz = enableHarfbuzz;
    
    // Step 4: Display the Result to the User
    // Show an alert message based on whether Harfbuzz was enabled or disabled
    if (enableHarfbuzz) {
        alert("Harfbuzz was enabled successfully");
    } else {
        alert("Harfbuzz was disabled successfully.");
    }

    // Step 5: Display Special Note
    // Show a message instructing the user to press [ Ctrl + Alt + / ] to recompose the text
    alert("Note: Now Press [ Ctrl + Alt + / ] keys to recompose the text.");

} catch (e) {
    // Error Handling
    // If any error occurs during the process, display an alert with the error message
    alert("Error applying setting: " + e.message);
}
