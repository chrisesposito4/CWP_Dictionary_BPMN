import * as fs from 'fs';
import * as path from 'path';
import * as rd from 'readline';
import * as vscode from 'vscode';

export enum name_type {
        CategoryName=0,
        Code,
        Expression,
        Info,
        State,
		Unknown,
        Variable,
        Type
    };

let currentCategory : name_type = name_type.Unknown;
let parentItem : tree_item;

export class tree_item extends vscode.TreeItem {

        public readonly item_name: string;
		public contextValue : string;
		
        public item_type: name_type;
        public children: tree_item[] = [];
		public tooltip : string;
		
		public toString() {
            let typename = name_type[this.item_type];
			return ` item_Name : ${this.item_name}, item_type: ${typename}`;
        }

        constructor(label: string, category : name_type, is_category_name : boolean) {
            super(label, vscode.TreeItemCollapsibleState.None);
			this.item_name = label;
            this.contextValue = label;
            this.item_type = category;

			if(is_category_name)
			{
				this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
				this.item_type = name_type.CategoryName;		
                this.tooltip = 'category name'	;
			}
			else
			{
				this.collapsibleState = vscode.TreeItemCollapsibleState.None;
                if(category === name_type.State)
                {
                    this.tooltip = 'name of a BPMN state';
                }
                else
                {
                    this.tooltip = 'should conform to LTL syntax';
                }
                
			}
        }

        public add_child (child : tree_item) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            this.children.push(child);
        }
    }

    export  class tree_view_data {
        private data : tree_item [] = [];
        
        public add_item(item: tree_item) {
            this.data.push(item);
        }

        public get_data() {
            return this.data;
        }
		
		public erase_data() {
            this.data = [];
        }

        public at(index: number){
            return this.data.at(index);
        }
    }

    export class tree_view implements vscode.TreeDataProvider<tree_item>
    {
        public data : tree_view_data = new tree_view_data();
        private pathToDict : string = 'none';
        private isDictLoaded : boolean = false;
        private _onDidChangeTreeData: vscode.EventEmitter<tree_item | undefined | null | void> = new vscode.EventEmitter<tree_item | undefined | null | void>();
        readonly onDidChangeTreeData: vscode.Event<tree_item | undefined | null | void> = this._onDidChangeTreeData.event;


        public constructor()  {
            vscode.commands.registerCommand('cwpinfo.item_copy', item => this.item_copy(item));
            vscode.commands.registerCommand('cwpinfo.refresh', () => this.refresh());
            vscode.commands.registerCommand('cwpinfo.item_clicked', item => this.item_clicked(item));
            
        }

        public item_copy(item : tree_item)
        {
            let mytext : string = item.label ? item.label.toString() : "empty field";
            vscode.env.clipboard.writeText(mytext);
            //console.log('item copied is ' + mytext);
            vscode.window.showInformationMessage('item copied: ' + item.label);
        }

        public getTreeItem(item: tree_item): vscode.TreeItem|Thenable<vscode.TreeItem> {
            var title = item.label ? item.label.toString() : " empty ";
            var is_category : boolean = (item.item_type === name_type.CategoryName);
            var result = new  tree_item(title, item.item_type, is_category);

            //
            result.command = { command: 'cwpinfo.item_clicked', title : title, arguments: [item] };
            result.iconPath = item.iconPath;
            return result;
        }
    
        public getChildren(element : tree_item | undefined): vscode.ProviderResult<tree_item[]> {
            return (element === undefined) ? this.data.get_data() : element.children;
        }

        public item_clicked(item: tree_item) {
            let mytext : string = item.label ? item.label.toString() : "empty field";
            vscode.env.clipboard.writeText(mytext);
            //console.log('item copied is ' + mytext);
            vscode.window.showInformationMessage('item copied: ' + item.label);
            
        }

        public refresh() {
 
                //console.log('refreshing data');
                //this.data.erase_data();
                this._onDidChangeTreeData.fire();
                //console.log(this.data);
                //this.read_directory(vscode.workspace.workspaceFolders[0].uri.fsPath);
                //this.reload_tree_data();
            
        }

    }
    
