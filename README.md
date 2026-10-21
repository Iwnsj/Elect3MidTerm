# KotlinDroid Studio Prep 📱

An interactive web-based reviewer, live widget & Logcat simulator, 3D flashcard deck, practice exam, and syntax matcher for **Android Studio using Kotlin**.

## Covered Topics
1. **RecyclerView** (`RecyclerView.Adapter`, `ViewHolder`, `LayoutManager`, `onCreateViewHolder`, `onBindViewHolder`, `getItemCount`)
2. **CheckBox** (`isChecked`, `setOnCheckedChangeListener`, `toggle()`, multi-selection)
3. **RadioButton & RadioGroup** (`checkedRadioButtonId`, `clearCheck()`, single-selection mutual exclusion)
4. **Spinner** (`ArrayAdapter`, `setDropDownViewResource`, `AdapterView.OnItemSelectedListener`, `getItemAtPosition`)
5. **Switch / SwitchCompat / MaterialSwitch** (`isChecked`, `setOnCheckedChangeListener`, `thumbTint`, `trackTint`)
6. **Passing Data Between Activities** (Explicit `Intent`, `putExtra`, `getStringExtra`, `getIntExtra`, `getBooleanExtra`)
7. **Menus & Toolbars** (`Toolbar`, `setSupportActionBar`, `onCreateOptionsMenu`, `menuInflater.inflate`, `onOptionsItemSelected`, `app:showAsAction`)
8. **SharedPreferences** (`getSharedPreferences`, `Context.MODE_PRIVATE`, `edit()`, `putString`/`putInt`/`putBoolean`, `apply()` vs `commit()`, `clear()`)

## Project Structure
```text
├── index.html      # Main application layout & UI modes
├── styles.css      # Custom styles, 3D card flip animations, and phone frame
├── data.js         # Study notes, XML/Kotlin snippets, 32 flashcards, 24 quiz items, 16 syntax drills
├── app.js          # Reviewer filter/search, live Logcat simulator, flashcards, quiz, and matcher logic
└── README.md       # Deployment & usage guide
```

## How to Run Locally
1. Extract `kotlindroid-studio-prep.zip`.
2. Double-click `index.html` to open it in any browser, or serve it with VS Code's **Live Server** extension.

## How to Deploy to GitHub Pages
1. Create a new repository on GitHub (e.g., `kotlindroid-studio-prep`).
2. Extract the contents of this `.zip` folder and push the files to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: KotlinDroid Studio Prep web reviewer"
   git branch -M main
   git remote add origin https://github.com/<your-username>/kotlindroid-studio-prep.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings** → **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, select the `main` branch and `/ (root)` folder, and click **Save**.
5. Your live reviewer site will be published at `https://<your-username>.github.io/kotlindroid-studio-prep/`.
