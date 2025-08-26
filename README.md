# cwpinfo README

This is the README for the extension "cwpinfo". It exists so the VS Code user can load, display and use the informtion in a CWP Dictionary file that has been created (via the GenCWP_Dictionary tool). These dictionary files contain the variables, states, expressions, types and creation metadata from the abstract class diagram and the finite state diagram from a CWP. 

## Installation
This extension (current version is v1.0.0) is not yet published in the VS Code extension marketplace, so it will have to be installed off-line from a Visual Studio extension file ( the suffix is '.vsix'). The extension to install is named 'cwpinfo-1.0.0.vsix' in the repository at https://github.com/chrisesposito4/CWP_Dictionary_BPMN 


To install a VS Code extension from a .vsix file, open the Extensions menu in VS Code, click the three-dot menu at the top, and select "Install from VSIX...". Follow the prompts to complete the installation, and you may need to reload VS Code afterward.  

You will also need to install the Open-BPMN (current is v1.1.22) extension from the extension marketplace.  This extension also requires at least Java 17 be installed beforehand. 
Under the covers this extension is actually split into 2 pieces - the  client piece written in Typescript that is visible and runs in vscode and a back-end server piece written in Java. They collaborate to provide the ability to create/ display / edit / store BPMN diagrams. See the 'demo.bpmn' file for an example to load.

The UI for loading / saving BPMN files is the standard one for VS Code - File menu, then 'Open File' to look for the desired BPMN file; Use 'New File' and use the .bpmn extension to create an empty diagram; 'Save' or 'Save As' to save the new or modified diagram.

## Features

There are only a few features included:
       View --> Command Palette --> CWP Check Install - you should see a popup info message in the lower right area of the window that the extension is installed. 
	   
	   View --> Command Palette --> CWP Import Dictionary - this will pop up a file chooser dialog to allow the selection of a file that was exported by GenCWP_Dictionary tool.  There is a particular file format expected, but no specific file naming convention is expected or enforced, so choose carefully. See the sample_CWP_Dictionary.txt file for an example of the files accepted.
	   
	   View --> Command Palette --> CWP Refresh - if a dictionary file has been changed and reloaded but changes aren't visible, this should refresh the tree.
	   
	   Once the tree is loaded, the left-side explorer window will have a tree structure view prefixed with 'CWP Dictionary' in the title. The top-level branches in the tree should be 'Info', 'Types', 'Variables', 'States', and 'Expressions'. Expanding each of these should show the entries in their respective categories. Either clicking on one of the child tree entries or right-clicking and choosing 'Copy Value' from the context menu will copy the chosen value to the system clipboard, making it available to paste into a selected BPMN diagram entity's property text field.

## Requirements

It is expected that this extension is used in conjunction with the Open BPMN VS code extension that supports the creation and editing of BPMN 2.x diagrams. The values in the dictionary tree structure can be copied and pasted (via either a left-click to select, or a right-mouse-down context menu to copy the value to the clipboard) into a BPMN entity's properties.

## Release Notes

initial release; please also install the Open BPMN extension into VS Code from the Extension Marketplace.

### 1.0.0

Initial release - currently separate from the Open BPMN extension. the plan is to integrate this extension into that one in the next release. 

**Enjoy!**
