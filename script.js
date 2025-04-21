// ダークモード対応
document.addEventListener('DOMContentLoaded', () => {
    // システムのカラースキームをチェック
    const checkColorScheme = () => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark-mode', isDarkMode);
    };

    // 初期チェック
    checkColorScheme();

    // システムのカラースキーム変更を監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkColorScheme);
});