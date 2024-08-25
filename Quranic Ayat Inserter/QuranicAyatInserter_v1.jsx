/**
 * Divine Verses: Quranic Ayat Inserter
 * -------------------------------------
 * This script is designed for Adobe InDesign and allows users to insert Quranic Ayat (verses) into their documents.
 * Users can select Ayat by Surah (chapter) or Parah (section), specify the range of Ayat, and choose whether to include 'Bismillah',
 * ornate parentheses, and references. This script ensures that 'Bismillah' is included whenever the checkbox is selected.
 */

#target indesign

// Quran data containing Ayat details, indexed by Surah and Parah
var quranData = {
    ayat: [
        { id: 1, surahAyatNum: 0, text: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ\u06DD۱", parahIndex: 1, parahName: "الٓمّٓ", surahIndex: 1, surahName: "الْفَاتِحَة" },
        { id: 2, surahAyatNum: 1, text: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِیْنَ \u06DD۲ۙ ", parahIndex: 1, parahName: "الٓمّٓ", surahIndex: 1, surahName: "الْفَاتِحَة" },
        { id: 6344, surahAyatNum: 0, text: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ", parahIndex: 30, parahName: "عَمَّ", surahIndex: 114, surahName: "النَّاس" },
        { id: 6345, surahAyatNum: 1, text: "قُلْ اَعُوْزُ بِرَبِّ النَّاسِ \u06DD۱ۙ ", parahIndex: 30, parahName: "عَمَّ", surahIndex: 114, surahName: "النَّاس" },
        { id: 6346, surahAyatNum: 2, text: "مَلِكِ النَّاسِ \u06DD۲ۙ ", parahIndex: 30, parahName: "عَمَّ", surahIndex: 114, surahName: "النَّاس" },
        { id: 6347, surahAyatNum: 3, text: "اِلٰهِ النَّاسِ \u06DD۳ۙ ", parahIndex: 30, parahName: "عَمَّ", surahIndex: 114, surahName: "النَّاس" },
        { id: 6348, surahAyatNum: 4, text: "مِنْ شَرِّ الْوَسْوَاسِ ࣢ۙ الْخَنَّاسِ \u06DD۴ࣕۙ ", parahIndex: 30, parahName: "عَمَّ", surahIndex: 114, surahName: "النَّاس" },
        { id: 6349, surahAyatNum: 5, text: "الَّذِیْ یُوَسْوِسُ فِیْ صُدُوْرِ النَّاسِ \u06DD۵ۙ ", parahIndex: 30, parahName: "عَمَّ", surahIndex: 114, surahName: "النَّاس" },
        { id: 6350, surahAyatNum: 6, text: "مِنَ الْجِنَّةِ وَ النَّاسِ \u06DD۶ࣖ ", parahIndex: 30, parahName: "عَمَّ", surahIndex: 114, surahName: "النَّاس" },
        // Additional Ayat can be added here.
    ]
};

// Grouping Ayat data by Parah and Surah, excluding Ayat with surahAyatNum: 0
var parahData = {};
var surahData = {};

for (var i = 0; i < quranData.ayat.length; i++) {
    var ayat = quranData.ayat[i];
    
    // Skip Ayat with surahAyatNum: 0 to exclude 'Bismillah' from the main groupings
    if (ayat.surahAyatNum !== 0) {
        // Grouping by Parah
        if (!parahData[ayat.parahIndex]) {
            parahData[ayat.parahIndex] = { name: ayat.parahName, ayat: [] };
        }
        parahData[ayat.parahIndex].ayat.push(ayat);
        
        // Grouping by Surah
        if (!surahData[ayat.surahIndex]) {
            surahData[ayat.surahIndex] = { name: ayat.surahName, ayat: [] };
        }
        surahData[ayat.surahIndex].ayat.push(ayat);
    }
}

/**
 * Function to remove diacritics from Arabic text.
 * Useful for searching Ayat text without the influence of diacritics.
 */
function removeDiacritics(text) {
    var diacritics = /[\u064B-\u0652\u06D6-\u06ED\u0670\u06E7\u06E8\u06EA-\u06ED]/g;
    return text.replace(diacritics, "");
}

/**
 * Function to create and display the dialog window.
 * The dialog allows users to select Ayat by Parah or Surah, specify the range, and choose additional options.
 */
function createDialog() {
    var dialog = new Window("dialog", "Divine Verses: Quranic Ayat Inserter");
    dialog.graphics.font = ScriptUI.newFont(dialog.graphics.font.name, "bold", dialog.graphics.font.size);

    // Group for selection (Parah or Surah)
    var selectionGroup = dialog.add("group");
    selectionGroup.add("statictext", undefined, "Select:");
    var selectionDropdown = selectionGroup.add("dropdownlist", undefined, ["Parah", "Surah"]);
    selectionDropdown.selection = 0; 

    // Group for Parah selection
    var parahGroup = dialog.add("group");
    parahGroup.add("statictext", undefined, "Parah:");
    var parahDropdown = parahGroup.add("dropdownlist", undefined, []);
    for (var parahIndex in parahData) {
        parahDropdown.add("item", parahIndex + ". " + parahData[parahIndex].name);
    }
    parahDropdown.selection = 0; 

    // Group for Surah selection
    var surahGroup = dialog.add("group");
    surahGroup.add("statictext", undefined, "Surah:");
    var surahDropdown = surahGroup.add("dropdownlist", undefined, []);
    for (var surahIndex in surahData) {
        surahDropdown.add("item", surahIndex + ". " + surahData[surahIndex].name);
    }
    surahDropdown.selection = 0; 

    // Group for Ayah range input
    var ayahGroup = dialog.add("group");
    ayahGroup.add("statictext", undefined, "From Ayah:");
    var fromAyahInput = ayahGroup.add("edittext", undefined, "1");
    fromAyahInput.characters = 5;
    ayahGroup.add("statictext", undefined, "To Ayah:");
    var toAyahInput = ayahGroup.add("edittext", undefined, "1");
    toAyahInput.characters = 5;

    // Checkbox for adding Bismillah
    var bismillahCheckbox = dialog.add("checkbox", undefined, "Add: بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ");

    // Checkbox for adding Ornate Parenthesis
    var ornateParenCheckbox = dialog.add("checkbox", undefined, "Add: Ornate parenthesis ﴾﴿");

    // Checkbox for adding Reference
    var referenceCheckbox = dialog.add("checkbox", undefined, "Include Reference");

    /**
     * Function to update Ayah fields based on the user's selection.
     * Updates the available Ayah range when the user selects a different Parah or Surah.
     */
    function updateAyahFields() {
        var selection = selectionDropdown.selection.text;
        if (selection === "Parah") {
            var selectedParahIndex = parseInt(parahDropdown.selection.text.split(".")[0]);
            if (parahData[selectedParahIndex]) {
                fromAyahInput.text = "1";
                toAyahInput.text = parahData[selectedParahIndex].ayat.length.toString();
            }
        } else {
            var selectedSurahIndex = parseInt(surahDropdown.selection.text.split(".")[0]);
            if (surahData[selectedSurahIndex]) {
                fromAyahInput.text = "1";
                toAyahInput.text = surahData[selectedSurahIndex].ayat.length.toString();
            }
        }
    }

    // Event listeners for dropdown and input changes
    selectionDropdown.onChange = function() {
        var selection = selectionDropdown.selection.text;
        if (selection == "Parah") {
            parahGroup.visible = true;
            surahGroup.visible = false;
        } else {
            parahGroup.visible = false;
            surahGroup.visible = true;
        }
        updateAyahFields();
    };

    parahDropdown.onChange = updateAyahFields;
    surahDropdown.onChange = updateAyahFields;

    // Group for buttons (Insert and Cancel)
    var buttonGroup = dialog.add("group");
    var insertButton = buttonGroup.add("button", undefined, "Insert the Selected Ayat's");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    insertButton.onClick = function() {
        dialog.close(1);
    };

    cancelButton.onClick = function() {
        dialog.close(0);
    };

    // Group for search functionality
    var searchGroup = dialog.add("group");
    searchGroup.add("statictext", undefined, "Search:");
    var searchInput = searchGroup.add("edittext", undefined, "");
    searchInput.characters = 20;
    var searchButton = searchGroup.add("button", undefined, "Search");
    var resetButton = searchGroup.add("button", undefined, "Reset");

    var resultGroup = dialog.add("group");
    resultGroup.orientation = "column";
    var resultList = resultGroup.add("listbox", undefined, [], {multiselect: false});
    resultList.preferredSize.width = 300;
    resultList.preferredSize.height = 200;

    /**
     * Function to perform the search and display results in the listbox.
     * Searches for the text in the Ayat data and displays matching results.
     */
    var performSearch = function() {
        var searchText = removeDiacritics(searchInput.text);
        resultList.removeAll();
        for (var i = 0; i < quranData.ayat.length; i++) {
            var ayahText = removeDiacritics(quranData.ayat[i].text);
            if (ayahText.indexOf(searchText) !== -1) {
                resultList.add("item", quranData.ayat[i].text);
            }
        }
    };

    /**
     * Function to reset the search and clear the results.
     * Clears the search input and removes all items from the result list.
     */
    var resetSearch = function() {
        searchInput.text = "";
        resultList.removeAll();
    };

    // Event listeners for search functionality
    searchButton.onClick = performSearch;
    searchInput.addEventListener('keydown', function(event) {
        if (event.keyName === 'Enter') {
            performSearch();
        }
    });
    resetButton.onClick = resetSearch;

    // Set initial visibility and update fields
    parahGroup.visible = true;
    surahGroup.visible = false;
    updateAyahFields();

    return {
        dialog: dialog,
        selectionDropdown: selectionDropdown,
        parahDropdown: parahDropdown,
        surahDropdown: surahDropdown,
        fromAyahInput: fromAyahInput,
        toAyahInput: toAyahInput,
        insertButton: insertButton,
        bismillahCheckbox: bismillahCheckbox,
        ornateParenCheckbox: ornateParenCheckbox,
        referenceCheckbox: referenceCheckbox,
        resultList: resultList
    };
}

/**
 * Function to retrieve Ayahs based on selection and user options.
 * Retrieves Ayahs from the selected Parah or Surah and applies user preferences.
 * Ensures 'Bismillah' is included if the checkbox is checked.
 */
function getAyahs(type, index, fromAyah, toAyah, includeBismillah, includeOrnateParen) {
    var ayahs = [];

    // Include Bismillah if the checkbox is checked, regardless of range
    if (includeBismillah) {
        for (var i = 0; i < quranData.ayat.length; i++) {
            if (quranData.ayat[i].surahIndex === index && quranData.ayat[i].surahAyatNum === 0) {
                ayahs.push(quranData.ayat[i].text);
                break;
            }
        }
    }
    
    // Add selected Ayahs to the list
    if (type === "Parah") {
        var parah = parahData[index];
        if (parah) {
            for (var i = fromAyah - 1; i < toAyah; i++) {
                if (i < parah.ayat.length) {
                    ayahs.push(parah.ayat[i].text);
                }
            }
        }
    } else {
        var surah = surahData[index];
        if (surah) {
            for (var i = fromAyah - 1; i < toAyah; i++) {
                if (i < surah.ayat.length) {
                    ayahs.push(surah.ayat[i].text);
                }
            }
        }
    }

    // Add Ornate Parenthesis if the checkbox is checked
    if (includeOrnateParen) {
        var nbspace = "\u00A0";
        var ornateparenright = "\uFD3F";
        var ornateparenleft = "\uFD3E";

        // Add ornateparenright before the first Ayah in the selected range, unless it is surahAyatNum 0
        if (ayahs.length > 0 && isSurahAyatNum0(ayahs[0]) === false) {
            ayahs[0] = ornateparenright + nbspace + ayahs[0];
        } else if (ayahs.length > 1 && isSurahAyatNum0(ayahs[1]) === false) {
            ayahs[1] = ornateparenright + nbspace + ayahs[1];
        }

        // Add ornateparenleft at the end of the last Ayah
        ayahs[ayahs.length - 1] = ayahs[ayahs.length - 1] + nbspace + ornateparenleft;
    }

    return ayahs;
}

/**
 * Function to check if an Ayah has surahAyatNum 0 (typically 'Bismillah').
 * Used to conditionally apply ornate parentheses based on Ayah content.
 */
function isSurahAyatNum0(ayahText) {
    for (var i = 0; i < quranData.ayat.length; i++) {
        if (quranData.ayat[i].text === ayahText && quranData.ayat[i].surahAyatNum === 0) {
            return true;
        }
    }
    return false;
}

/**
 * Function to insert Ayahs into the document at the selected position.
 * Inserts the retrieved Ayahs with all user-selected options applied (e.g., 'Bismillah', ornate parentheses, references).
 */
function insertAyahs(type, index, fromAyah, toAyah, includeBismillah, includeOrnateParen, includeReference) {
    var ayahs = getAyahs(type, index, fromAyah, toAyah, includeBismillah, includeOrnateParen);
    if (ayahs.length > 0) {
        if (includeReference) {
            var surahName = (type === "Parah") ? parahData[index].name : surahData[index].name;
            var referenceText = "\n[" + surahName + ": " + (fromAyah === toAyah ? fromAyah : fromAyah + "-" + toAyah) + "]\n";
            ayahs.push(referenceText);
        }
        
        var doc = app.activeDocument;
        var selection = app.selection[0];

        if (selection && selection.hasOwnProperty("insertionPoints")) {
            var insertionPoint = selection.insertionPoints[0];
            insertionPoint.contents = ayahs.join("\n");
        } else {
            alert("Please place the cursor in a text frame.");
        }
    } else {
        alert("No Ayahs found for the selected range.");
    }
}

/**
 * Main function to initiate the script.
 * Creates the dialog, gathers user input, and inserts the selected Ayahs into the document.
 */
function main() {
    var dialogData = createDialog();
    var result = dialogData.dialog.show();

    if (result == 1) {
        var selection = dialogData.selectionDropdown.selection.text;
        var index = selection === "Parah" ? parseInt(dialogData.parahDropdown.selection.text.split(".")[0]) : parseInt(dialogData.surahDropdown.selection.text.split(".")[0]);
        var fromAyah = parseInt(dialogData.fromAyahInput.text);
        var toAyah = parseInt(dialogData.toAyahInput.text);
        var includeBismillah = dialogData.bismillahCheckbox.value;
        var includeOrnateParen = dialogData.ornateParenCheckbox.value;
        var includeReference = dialogData.referenceCheckbox.value;

        // Validate the Ayah range before inserting
        if (fromAyah <= toAyah && fromAyah > 0 && toAyah <= (selection === "Parah" ? parahData[index].ayat.length : surahData[index].ayat.length)) {
            insertAyahs(selection === "Parah" ? "Parah" : "Surah", index, fromAyah, toAyah, includeBismillah, includeOrnateParen, includeReference);
        } else {
            alert("Invalid Ayah range. Please ensure that the 'From Ayah' is less than or equal to the 'To Ayah' and within the range of available Ayahs.");
        }
    }
}

// Run the main function to start the script
main();
