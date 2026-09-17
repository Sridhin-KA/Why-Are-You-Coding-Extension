import * as vscode from 'vscode';

type RoastLevel = 'friendly' | 'sarcastic' | 'brutal' | 'destroy';

let roastCount = 0;
let currentLevel: RoastLevel = 'sarcastic';

const LEVEL_KEY = 'whyAreYouCoding.roastLevel';

const roasts: Record<RoastLevel, string[]> = {
    friendly: [
        '😊 Nice code! A little cleanup and you are good to go.',
        '🌱 Every developer starts somewhere. Keep going!',
        '👍 Not bad! Your code has potential.',
        '☕ Take a break and come back with fresh eyes.',
        '✨ Your code is doing its best.'
    ],

    sarcastic: [
        '😏 Interesting approach. Very... creative.',
        '😂 I have questions. Many questions.',
        '🐛 The bug is probably hiding somewhere obvious.',
        '☕ Have you tried coffee? Again?',
        '🤨 You really looked at this code and said "ship it".',
        '🧠 Stack Overflow is proud of you.',
        '💻 It works on your machine. Congratulations!'
    ],

    brutal: [
        '🔥 I have seen production code with fewer problems.',
        '💀 This code needs a therapist.',
        '🐛 The bugs are having a meeting in here.',
        '😭 Your future self is going to hate you.',
        '🤡 Who approved this? Oh... you did.',
        '💻 Your CPU deserves better.',
        '🚨 This code should come with a warning label.'
    ],

    destroy: [
        '💀 This is not code. This is a cry for help.',
        '☠️ Even the compiler needs emotional support.',
        '🔥 Delete the repository and pretend this never happened.',
        '💀 Git just saw this commit and considered quitting.',
        '🤡 Your keyboard deserves compensation.',
        '☠️ Somewhere, a senior developer just felt a disturbance in the Force.',
        '💀 I would explain the problem, but we would be here all day.',
        '🔥 This code has officially offended the programming language.'
    ]
};

export function activate(context: vscode.ExtensionContext) {

    // Load saved roast level
    const savedLevel =
        context.globalState.get<RoastLevel>(LEVEL_KEY);

    if (savedLevel) {
        currentLevel = savedLevel;
    }

    // 😂 Roast Me button
    const roastButton = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    roastButton.text = '😂 Roast Me';
    roastButton.tooltip = 'Click me if you dare';
    roastButton.command = 'why-are-you-coding.roast';
    roastButton.show();


    // 🎚️ Roast level button
    const levelButton = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        99
    );

    levelButton.text = `🎚️ ${getLevelName()}`;
    levelButton.tooltip = 'Change roast level';
    levelButton.command = 'why-are-you-coding.chooseLevel';
    levelButton.show();


    // 😂 Roast Me command
    const roastCommand = vscode.commands.registerCommand(
        'why-are-you-coding.roast',
        () => {
            showRoast();
        }
    );


    // 🎚️ Choose Roast Level
    const levelCommand = vscode.commands.registerCommand(
        'why-are-you-coding.chooseLevel',
        async () => {

            const selected = await vscode.window.showQuickPick(
                [
                    {
                        label: '😇 Friendly',
                        description: 'A gentle developer roast',
                        value: 'friendly'
                    },
                    {
                        label: '😏 Sarcastic',
                        description: 'A little painful',
                        value: 'sarcastic'
                    },
                    {
                        label: '🔥 Brutal',
                        description: 'No mercy',
                        value: 'brutal'
                    },
                    {
                        label: '💀 Destroy Me',
                        description: 'You asked for this',
                        value: 'destroy'
                    }
                ],
                {
                    placeHolder: 'Choose your roast level'
                }
            );

            if (selected) {

                currentLevel = selected.value as RoastLevel;

                // Save level
                await context.globalState.update(
                    LEVEL_KEY,
                    currentLevel
                );

                // Update status bar
                levelButton.text =
                    `🎚️ ${getLevelName()}`;

                vscode.window.showInformationMessage(
                    `🎚️ Roast level saved as: ${selected.label}`
                );
            }
        }
    );


    // 🔥 Roast selected code
    const roastCodeCommand = vscode.commands.registerCommand(
        'why-are-you-coding.roastCode',
        () => {

            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showWarningMessage(
                    '🤨 Bro, open a code file first.'
                );
                return;
            }

            const selectedCode = editor.document.getText(
                editor.selection
            );

            if (!selectedCode.trim()) {
                vscode.window.showWarningMessage(
                    '🧐 Select some code first. I need something to roast.'
                );
                return;
            }

            const roast = getCodeRoast(selectedCode);

            roastCount++;

            vscode.window.showInformationMessage(
                `${roast} | 🔥 Roasts: ${roastCount}`
            );
        }
    );


    // Register everything
    context.subscriptions.push(
        roastCommand,
        levelCommand,
        roastCodeCommand,
        roastButton,
        levelButton
    );
}


// 😂 Show random roast
function showRoast() {

    const levelRoasts = roasts[currentLevel];

    const randomIndex = Math.floor(
        Math.random() * levelRoasts.length
    );

    const roast = levelRoasts[randomIndex];

    roastCount++;

    vscode.window.showInformationMessage(
        `${roast} | 🔥 Roasts: ${roastCount}`
    );
}


// 🎚️ Get current level name
function getLevelName(): string {

    switch (currentLevel) {

        case 'friendly':
            return '😇 Friendly';

        case 'sarcastic':
            return '😏 Sarcastic';

        case 'brutal':
            return '🔥 Brutal';

        case 'destroy':
            return '💀 Destroy';

        default:
            return '😏 Sarcastic';
    }
}


// 🔥 Roast selected code
function getCodeRoast(code: string): string {

    const lines = code.split('\n').length;
    const characters = code.length;

    if (lines === 1) {
        return '💀 One line? Bro wrote a whole career in one line.';
    }

    if (lines > 50) {
        return `📜 ${lines} lines?! Bro, this function needs its own ZIP code.`;
    }

    if (code.includes('console.log')) {
        return '🪵 console.log detected. The debugger is crying.';
    }

    if (code.includes('print(')) {
        return '🐍 print() detected. Congratulations, you invented debugging.';
    }

    if (code.includes('TODO')) {
        return '📝 TODO detected. Future You has officially been assigned homework.';
    }

    if (code.includes('any')) {
        return '☠️ TypeScript "any" detected. Type safety has left the building.';
    }

    if (code.includes('while (true)')) {
        return '♾️ Infinite loop detected. Your program has achieved immortality.';
    }

    if (code.includes('try') && code.includes('catch')) {
        return '🧯 Try/catch detected. When in doubt, catch everything.';
    }

    if (characters > 1000) {
        return '📚 Bro, this code is longer than the documentation.';
    }

    return '🔥 Respectfully... what is this code?';
}


export function deactivate() {}