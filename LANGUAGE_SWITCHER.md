# 🌐 Language Switcher - DE/EN

## ✅ Language Toggle Button Added!

You can now switch between **German** and **English** throughout the entire app.

---

## 🔘 How to Use

Look for the language button in the **top-right corner** of the header (next to Settings and Logout).

It shows: **`🌐 DE`** or **`🌐 EN`**

**Click it** to toggle between languages!

---

## 🎯 What Changes

When you switch languages, ALL text in the app changes:

### German (DE):
- "PiA Vergütung Tracker"
- "Eintrag hinzufügen"
- "Bruttogehalt"
- "Einkommenssteuer"
- "Einstellungen"
- German month names (Januar, Februar, März...)

### English (EN):
- "PiA Salary Tracker"
- "Add Entry"
- "Gross Salary"
- "Income Tax"
- "Settings"
- English month names (January, February, March...)

---

## 💾 Your Choice is Saved

Your language preference is **automatically saved** in your browser.

When you come back, the app will remember your language choice!

---

## 📱 Works Everywhere

The language switcher works on:
- ✅ Dashboard
- ✅ Summary cards
- ✅ Data table
- ✅ Add/Edit entry forms
- ✅ Settings page
- ✅ Login/Signup pages
- ✅ All buttons and labels

---

## 🎨 Button Location

```
┌─────────────────────────────────────────────┐
│ PiA Vergütung Tracker    [🌐 DE] [⚙] [↗]  │
└─────────────────────────────────────────────┘
                            ↑
                    Click here to toggle!
```

The button shows:
- **🌐 DE** when in German mode
- **🌐 EN** when in English mode

---

## 🔧 For Developers

The language system uses:
- **`lib/translations.ts`** - All text translations
- **`lib/language-context.tsx`** - Language state management
- **`localStorage`** - Saves preference
- React Context API - Shares language across components

To add new translations:
1. Open `lib/translations.ts`
2. Add your text to both `de` and `en` objects
3. Use it in components with `t.yourNewText`

---

Enjoy the app in your preferred language! 🎉
