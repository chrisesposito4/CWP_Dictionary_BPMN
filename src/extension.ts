// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as fs from 'fs';
import * as tv from './tree_view';

let dictionaryLines: string[];
let filePath = "none";																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																				
let dict_tree_datamodel : tv.tree_view;
let dict_tree : vscode.TreeView<tv.tree_item>;
let CategoryDelimiters : string[] = ['#Code', '#Expressions', '#Info', '#States', '#Variables', "#Types"];
let CategoryTypeNames : tv.name_type[] = [tv.name_type.Code, tv.name_type.Expression, tv.name_type.Info, tv.name_type.State,  tv.name_type.Variable, tv.name_type.Type, tv.name_type.CategoryName, tv.name_type.Unknown];

let currentCategory : tv.name_type = tv.name_type.Unknown;
let parentItem : tv.tree_item;


function checkForCategoryName(name : string) : number
{
	let myIndex : number = CategoryDelimiters.indexOf(name);
	//console.log('checkForCategoryName (' + name + ')=' + myIndex);
	return myIndex;
}

async function handleDictionarySelect()
{
	vscode.window.showInformationMessage('importing dictionary');


	const options : vscode.OpenDialogOptions = {        canSelectMany: false,
        openLabel: 'Choose a cwp dictionary',
        canSelectFiles: true,
        canSelectFolders: false
    };


	vscode.window.showOpenDialog(options).then(fileUri => {
        if (fileUri && fileUri[0]) {
            
            filePath = String(fileUri[0].fsPath);
			console.log('selected: ' + filePath); //Outputs when dialog is closed.
			load_CWP_Dictionary(filePath);
        }
    });
    return Promise.resolve(filePath);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cwpinfo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const ckInstall = vscode.commands.registerCommand('cwpinfo.CheckInstall', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('The CWPInfo extension is installed!');
	});

	const importDictCmd = vscode.commands.registerCommand('cwpinfo.ImportDict', handleDictionarySelect );
	dict_tree_datamodel = new tv.tree_view();

	dict_tree = vscode.window.createTreeView('cwp-dictionary', {treeDataProvider : dict_tree_datamodel } );

	context.subscriptions.push(ckInstall);
	context.subscriptions.push(importDictCmd);
}



// This method is called when your extension is deactivated
export function deactivate() {
	console.log('condolences, your extension "cwpinfo" is now inactive!');
};

function load_CWP_Dictionary(pathToDictionary:string) {

	//console.log('trying to open ' + pathToDictionary);
	try{
		const content: string = fs.readFileSync(pathToDictionary, 'utf-8');
		dictionaryLines = content.split(/\r?\n/); //

		/*
  		console.log('File content as an array of strings:'); //
  		for (const line of dictionaryLines) { //
    		console.log(line); //
		}
			*/

		for (const line of dictionaryLines)
		{
			if(line.length < 1)
			{
				continue;
			}

			let itemIndex : number = checkForCategoryName(line);
			if(itemIndex > -1) // a new category 
			{
				//console.log('new category name: ' + line);
				currentCategory = CategoryTypeNames[itemIndex];	
				//console.log('new category name - new currentCategory is ' + currentCategory);
				let nameOfCat = tv.name_type[currentCategory];
				//console.log('category enum value is ' + nameOfCat);		
				parentItem = new tv.tree_item(line, currentCategory, true);
				//console.log('parent' + parentItem.toString());
				dict_tree_datamodel.data.add_item(parentItem);				
			}
			else
			{
				//console.log('  child in category name - currentCategory is ' + currentCategory);
				let firstSpace : number = line.indexOf(' ');
				if(firstSpace > -1)
				{
					let fieldValue : string = line.substring(firstSpace+1);
					
					let childItem : tv.tree_item = new tv.tree_item(fieldValue, currentCategory, false);
					
					//console.log('  child' + childItem.toString());
					parentItem.add_child(childItem);
				}
				else{
					console.log('missing 2nd field for line ' + line);
				}				
			}
		}
		dict_tree_datamodel.refresh();

		
	}
	catch (error: any) { //
		if (error.code === 'ENOENT') { //
			console.error('Error: File not found!'); //
			} else {
			console.error('Error reading file:', error); //
			}
	}

}
