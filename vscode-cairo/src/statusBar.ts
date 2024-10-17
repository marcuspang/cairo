import type { Context } from "./context";
import * as vscode from "vscode";
import * as lc from "vscode-languageclient/node";
import { Scarb } from "./scarb";

const CAIRO_STATUS_BAR_COMMAND = "cairo1.statusBar.clicked";

export class StatusBar {
  private statusBarItem: vscode.StatusBarItem;

  constructor(private readonly context: Context) {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.context.extension.subscriptions.push(this.statusBarItem);
  }

  public setupStatusBar(client?: lc.LanguageClient): void {
    this.context.extension.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("cairo1.showInStatusBar")) {
          this.updateStatusBar();
        }
      }),
    );

    this.context.extension.subscriptions.push(
      vscode.commands.registerCommand(CAIRO_STATUS_BAR_COMMAND, () => {
        if (client) {
          client.outputChannel.show();
        } else {
          vscode.window.showWarningMessage("Cairo Language Server is not active");
        }
      }),
    );
    this.statusBarItem.command = CAIRO_STATUS_BAR_COMMAND;

    this.updateStatusBar();
  }

  public async updateStatusBar(): Promise<void> {
    const config = vscode.workspace.getConfiguration("cairo1");
    const showInStatusBar = config.get<boolean>("showInStatusBar", true);

    if (showInStatusBar) {
      this.statusBarItem.text = "Cairo";
      this.statusBarItem.tooltip = "Cairo Language";

      try {
        // TODO(mkaput): Support multi-root workspaces.
        const scarb = await Scarb.find(vscode.workspace.workspaceFolders?.[0], this.context);
        if (scarb) {
          const version = await scarb.getVersion(this.context);
          this.statusBarItem.tooltip = `Cairo Language\n${version}`;
        }
      } catch (error) {
        this.context.log.error(`Error getting Scarb version: ${error}`);
      }

      this.statusBarItem.show();
    } else {
      this.statusBarItem.hide();
    }
  }

  public showStatusBarItem(): void {
    this.statusBarItem.show();
  }

  public hideStatusBarItem(): void {
    this.statusBarItem.hide();
  }
}
