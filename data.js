// KotlinDroid Studio Prep - Complete Study Dataset

const TOPICS = [
  {
    "id": "recyclerview",
    "title": "RecyclerView",
    "badge": "Lists & Adapters",
    "color": "purple",
    "summary": "An advanced, flexible version of ListView that efficiently recycles item views as they scroll off-screen using the ViewHolder pattern and a LayoutManager.",
    "keyPoints": [
      "Requires 3 core parts: LayoutManager (positions items), Adapter (binds data to views), and ViewHolder (caches view references).",
      "Always set layoutManager (e.g., LinearLayoutManager, GridLayoutManager, StaggeredGridLayoutManager) either in Kotlin or XML.",
      "Three mandatory Adapter overrides: onCreateViewHolder(), onBindViewHolder(), and getItemCount().",
      "Pass a lambda function to the Adapter constructor to cleanly handle item clicks in the Activity/Fragment."
    ],
    "apis": [
      {
        "name": "onCreateViewHolder(parent, viewType)",
        "desc": "Inflates the item layout XML (e.g., item_student.xml) and returns a new ViewHolder instance."
      },
      {
        "name": "onBindViewHolder(holder, position)",
        "desc": "Binds data at the given list index to the views held inside the ViewHolder."
      },
      {
        "name": "getItemCount()",
        "desc": "Returns the total number of items in the dataset."
      },
      {
        "name": "notifyDataSetChanged() / notifyItemInserted(pos)",
        "desc": "Notifies the RecyclerView that the underlying dataset has changed so the UI refreshes."
      }
    ],
    "xmlCode": "<!-- 1. In activity_main.xml -->\n<androidx.recyclerview.widget.RecyclerView\n    android:id=\"@+id/rvStudents\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    android:clipToPadding=\"false\"\n    android:padding=\"12dp\" />\n\n<!-- 2. In res/layout/item_student.xml -->\n<LinearLayout xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:orientation=\"vertical\"\n    android:padding=\"12dp\">\n\n    <TextView\n        android:id=\"@+id/tvName\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:textSize=\"16sp\"\n        android:textStyle=\"bold\" />\n\n    <TextView\n        android:id=\"@+id/tvCourse\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:textSize=\"14sp\" />\n</LinearLayout>",
    "kotlinCode": "data class Student(val name: String, val course: String)\n\nclass StudentAdapter(\n    private val items: List<Student>,\n    private val onItemClick: (Student) -> Unit\n) : RecyclerView.Adapter<StudentAdapter.StudentViewHolder>() {\n\n    inner class StudentViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {\n        val tvName: TextView = itemView.findViewById(R.id.tvName)\n        val tvCourse: TextView = itemView.findViewById(R.id.tvCourse)\n    }\n\n    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): StudentViewHolder {\n        val view = LayoutInflater.from(parent.context)\n            .inflate(R.layout.item_student, parent, false)\n        return StudentViewHolder(view)\n    }\n\n    override fun onBindViewHolder(holder: StudentViewHolder, position: Int) {\n        val student = items[position]\n        holder.tvName.text = student.name\n        holder.tvCourse.text = student.course\n        holder.itemView.setOnClickListener { onItemClick(student) }\n    }\n\n    override fun getItemCount(): Int = items.size\n}\n\n// Inside MainActivity.onCreate():\nval rvStudents = findViewById<RecyclerView>(R.id.rvStudents)\nrvStudents.layoutManager = LinearLayoutManager(this)\nrvStudents.adapter = StudentAdapter(studentList) { clicked ->\n    Toast.makeText(this, \"Selected: ${clicked.name}\", Toast.LENGTH_SHORT).show()\n}"
  },
  {
    "id": "checkbox",
    "title": "CheckBox",
    "badge": "Multi-Select Control",
    "color": "emerald",
    "summary": "A two-state button that can be either checked or unchecked. CheckBoxes work independently of each other, allowing users to select multiple options from a set.",
    "keyPoints": [
      "Inherits from CompoundButton -> Button -> TextView.",
      "Use checkBox.isChecked (Boolean) to inspect or programmatically change its state.",
      "Use setOnCheckedChangeListener { buttonView, isChecked -> ... } to react immediately when toggled.",
      "Multiple CheckBoxes do NOT need a container group to work independently."
    ],
    "apis": [
      {
        "name": "isChecked",
        "desc": "Boolean property to get or set the checked state of the CheckBox."
      },
      {
        "name": "setOnCheckedChangeListener",
        "desc": "Callback triggered whenever the checked state changes (passes buttonView and isChecked boolean)."
      },
      {
        "name": "android:checked=\"true\"",
        "desc": "XML attribute that sets the default initial state of the CheckBox to checked."
      },
      {
        "name": "toggle()",
        "desc": "Inverts the current checked state (true -> false, false -> true)."
      }
    ],
    "xmlCode": "<LinearLayout\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:orientation=\"vertical\"\n    android:padding=\"16dp\">\n\n    <CheckBox\n        android:id=\"@+id/cbKotlin\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:checked=\"true\"\n        android:text=\"Kotlin Fundamentals\" />\n\n    <CheckBox\n        android:id=\"@+id/cbAndroid\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:text=\"Android Jetpack UI\" />\n\n    <CheckBox\n        android:id=\"@+id/cbFirebase\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:text=\"Firebase Integration\" />\n</LinearLayout>",
    "kotlinCode": "val cbKotlin = findViewById<CheckBox>(R.id.cbKotlin)\nval cbAndroid = findViewById<CheckBox>(R.id.cbAndroid)\nval cbFirebase = findViewById<CheckBox>(R.id.cbFirebase)\n\n// Real-time listener on a single CheckBox\ncbKotlin.setOnCheckedChangeListener { _, isChecked ->\n    if (isChecked) {\n        Log.d(\"CheckBoxDemo\", \"Kotlin selected\")\n    } else {\n        Log.d(\"CheckBoxDemo\", \"Kotlin deselected\")\n    }\n}\n\n// Evaluating multiple CheckBoxes on Button click\nbtnSubmit.setOnClickListener {\n    val selectedTopics = mutableListOf<String>()\n    if (cbKotlin.isChecked) selectedTopics.add(\"Kotlin\")\n    if (cbAndroid.isChecked) selectedTopics.add(\"Android UI\")\n    if (cbFirebase.isChecked) selectedTopics.add(\"Firebase\")\n\n    Toast.makeText(this, \"Selected: ${selectedTopics.joinToString()}\", Toast.LENGTH_SHORT).show()\n}"
  },
  {
    "id": "radiobutton",
    "title": "RadioButton & RadioGroup",
    "badge": "Single-Select Control",
    "color": "sky",
    "summary": "RadioButtons allow the user to select strictly one option from a mutually exclusive set when wrapped inside a RadioGroup container.",
    "keyPoints": [
      "Wrapping RadioButtons inside a <RadioGroup> enforces mutual exclusion (checking one automatically unchecks the others).",
      "Every RadioButton inside a RadioGroup must have a unique android:id.",
      "radioGroup.checkedRadioButtonId returns the resource ID of the selected RadioButton, or -1 if none is selected.",
      "Once a RadioButton is checked, a user cannot uncheck it by tapping it again unless radioGroup.clearCheck() is called in code."
    ],
    "apis": [
      {
        "name": "checkedRadioButtonId",
        "desc": "Returns the Int ID of the currently selected RadioButton inside the RadioGroup (or -1 if none)."
      },
      {
        "name": "radioGroup.setOnCheckedChangeListener",
        "desc": "Lambda receives (group: RadioGroup, checkedId: Int) whenever selection changes."
      },
      {
        "name": "radioGroup.clearCheck()",
        "desc": "Programmatically clears the selection so no RadioButton is checked."
      },
      {
        "name": "radioGroup.check(R.id.rbOption)",
        "desc": "Programmatically selects a specific RadioButton by its ID."
      }
    ],
    "xmlCode": "<RadioGroup\n    android:id=\"@+id/rgYearLevel\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:orientation=\"vertical\">\n\n    <RadioButton\n        android:id=\"@+id/rbFirstYear\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:text=\"1st Year\" />\n\n    <RadioButton\n        android:id=\"@+id/rbSecondYear\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:text=\"2nd Year\" />\n\n    <RadioButton\n        android:id=\"@+id/rbThirdYear\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:checked=\"true\"\n        android:text=\"3rd Year\" />\n</RadioGroup>",
    "kotlinCode": "val rgYearLevel = findViewById<RadioGroup>(R.id.rgYearLevel)\n\n// Listen for selection changes on the RadioGroup\nrgYearLevel.setOnCheckedChangeListener { group, checkedId ->\n    if (checkedId != -1) {\n        val selectedRadio = group.findViewById<RadioButton>(checkedId)\n        Toast.makeText(this, \"Chosen: ${selectedRadio.text}\", Toast.LENGTH_SHORT).show()\n    }\n}\n\n// Reading the selected RadioButton on a Button click\nbtnConfirm.setOnClickListener {\n    val selectedId = rgYearLevel.checkedRadioButtonId\n    if (selectedId != -1) {\n        val rb = findViewById<RadioButton>(selectedId)\n        Log.d(\"RadioDemo\", \"Submitted year: ${rb.text}\")\n    } else {\n        Toast.makeText(this, \"Please select a year level\", Toast.LENGTH_SHORT).show()\n    }\n}"
  },
  {
    "id": "spinner",
    "title": "Spinner",
    "badge": "Dropdown Menu",
    "color": "amber",
    "summary": "Provides a compact dropdown menu that lets users choose one value from a predefined array or dynamic list using an ArrayAdapter.",
    "keyPoints": [
      "Uses an ArrayAdapter<T> to bridge a String array (or Kotlin List) to the Spinner UI.",
      "Always call adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item) for proper touch spacing in the open menu.",
      "Uses onItemSelectedListener (an object implementing AdapterView.OnItemSelectedListener), NOT setOnClickListener.",
      "Note that onItemSelected() fires automatically once when the Spinner is first initialized."
    ],
    "apis": [
      {
        "name": "ArrayAdapter.createFromResource(...)",
        "desc": "Creates an adapter directly from a <string-array> resource in res/values/strings.xml."
      },
      {
        "name": "setDropDownViewResource(layoutId)",
        "desc": "Defines the XML layout used for each row when the dropdown list is expanded."
      },
      {
        "name": "onItemSelectedListener",
        "desc": "Requires overriding both onItemSelected() and onNothingSelected()."
      },
      {
        "name": "parent.getItemAtPosition(position)",
        "desc": "Retrieves the selected item object at the chosen index."
      }
    ],
    "xmlCode": "<!-- 1. In res/values/strings.xml -->\n<resources>\n    <string-array name=\"programs_array\">\n        <item>BS Computer Engineering</item>\n        <item>BS Computer Science</item>\n        <item>BS Information Technology</item>\n    </string-array>\n</resources>\n\n<!-- 2. In activity_main.xml -->\n<Spinner\n    android:id=\"@+id/spinnerProgram\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:minHeight=\"48dp\" />",
    "kotlinCode": "val spinner = findViewById<Spinner>(R.id.spinnerProgram)\nval programs = listOf(\"BS Computer Engineering\", \"BS Computer Science\", \"BS Information Technology\")\n\n// Create and attach ArrayAdapter\nval adapter = ArrayAdapter(\n    this,\n    android.R.layout.simple_spinner_item,\n    programs\n)\nadapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)\nspinner.adapter = adapter\n\n// Handle item selection\nspinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {\n    override fun onItemSelected(\n        parent: AdapterView<*>?,\n        view: View?,\n        position: Int,\n        id: Long\n    ) {\n        val selected = parent?.getItemAtPosition(position).toString()\n        Log.d(\"SpinnerDemo\", \"Selected program: $selected (index $position)\")\n    }\n\n    override fun onNothingSelected(parent: AdapterView<*>?) {\n        // Optional fallback\n    }\n}"
  },
  {
    "id": "switch",
    "title": "Switch / SwitchCompat / MaterialSwitch",
    "badge": "On/Off Toggle",
    "color": "pink",
    "summary": "A two-state sliding toggle widget used to turn an immediate setting (like Dark Mode, Wi-Fi, or Notifications) ON or OFF.",
    "keyPoints": [
      "Like CheckBox, Switch inherits from CompoundButton, so it shares isChecked and setOnCheckedChangeListener.",
      "Prefer SwitchCompat (AppCompat) or MaterialSwitch (Material 3) over the legacy <Switch> widget for consistent cross-API styling.",
      "Best UX practice: Use Switches for instant settings changes, and CheckBoxes when the user must click a 'Submit' button later."
    ],
    "apis": [
      {
        "name": "isChecked",
        "desc": "Boolean property representing whether the switch is toggled ON (true) or OFF (false)."
      },
      {
        "name": "setOnCheckedChangeListener",
        "desc": "Triggered whenever the user slides or taps the switch."
      },
      {
        "name": "app:thumbTint / app:trackTint",
        "desc": "XML attributes to customize the color of the circular thumb and sliding track."
      },
      {
        "name": "android:textOn / android:textOff",
        "desc": "Defines accessibility/state labels for ON and OFF states."
      }
    ],
    "xmlCode": "<com.google.android.material.materialswitch.MaterialSwitch\n    android:id=\"@+id/switchDarkMode\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:checked=\"false\"\n    android:padding=\"12dp\"\n    android:text=\"Enable Dark Theme\" />",
    "kotlinCode": "val switchDarkMode = findViewById<MaterialSwitch>(R.id.switchDarkMode)\n\nswitchDarkMode.setOnCheckedChangeListener { _, isChecked ->\n    if (isChecked) {\n        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)\n        Toast.makeText(this, \"Dark Mode ON\", Toast.LENGTH_SHORT).show()\n    } else {\n        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)\n        Toast.makeText(this, \"Dark Mode OFF\", Toast.LENGTH_SHORT).show()\n    }\n}"
  },
  {
    "id": "intents",
    "title": "Passing Data Between Activities",
    "badge": "Explicit Intents & Extras",
    "color": "indigo",
    "summary": "Explicit Intents navigate from a source Activity to a target Activity while carrying key-value payload data inside an Intent Bundle.",
    "keyPoints": [
      "Create an Explicit Intent using Intent(this, SecondActivity::class.java).",
      "Attach data with intent.putExtra(\"KEY\", value) before calling startActivity(intent).",
      "In the receiving Activity, read values via intent.getStringExtra(\"KEY\") or intent.getIntExtra(\"KEY\", defaultValue).",
      "Reference types (String) return null if missing; primitive types (Int, Boolean, Double) require a mandatory default value argument."
    ],
    "apis": [
      {
        "name": "Intent(context, TargetActivity::class.java)",
        "desc": "Creates an explicit intent targeting a specific Activity class."
      },
      {
        "name": "putExtra(key, value)",
        "desc": "Packs primitive values, Strings, Bundles, or Parcelables into the Intent."
      },
      {
        "name": "getStringExtra(key)",
        "desc": "Retrieves a nullable String? from the incoming Intent."
      },
      {
        "name": "getIntExtra(key, defaultValue)",
        "desc": "Retrieves an Int extra, falling back to defaultValue if the key wasn't found."
      }
    ],
    "xmlCode": "<!-- In AndroidManifest.xml: Ensure target Activity is registered -->\n<application ...>\n    <activity\n        android:name=\".SecondActivity\"\n        android:exported=\"false\" />\n    <activity\n        android:name=\".MainActivity\"\n        android:exported=\"true\">\n        <intent-filter>\n            <action android:name=\"android.intent.action.MAIN\" />\n            <category android:name=\"android.intent.category.LAUNCHER\" />\n        </intent-filter>\n    </activity>\n</application>",
    "kotlinCode": "// --- 1. SENDING ACTIVITY (MainActivity.kt) ---\nbtnSend.setOnClickListener {\n    val intent = Intent(this, SecondActivity::class.java).apply {\n        putExtra(\"EXTRA_USERNAME\", \"Hans Valentino\")\n        putExtra(\"EXTRA_SCORE\", 98)\n        putExtra(\"EXTRA_IS_ADMIN\", true)\n    }\n    startActivity(intent)\n}\n\n// --- 2. RECEIVING ACTIVITY (SecondActivity.kt) ---\noverride fun onCreate(savedInstanceState: Bundle?) {\n    super.onCreate(savedInstanceState)\n    setContentView(R.layout.activity_second)\n\n    val username = intent.getStringExtra(\"EXTRA_USERNAME\") ?: \"Guest\"\n    val score = intent.getIntExtra(\"EXTRA_SCORE\", 0)\n    val isAdmin = intent.getBooleanExtra(\"EXTRA_IS_ADMIN\", false)\n\n    findViewById<TextView>(R.id.tvSummary).text =\n        \"User: $username | Score: $score | Admin: $isAdmin\"\n}"
  },
  {
    "id": "menus",
    "title": "Menus & Toolbars",
    "badge": "App Bar & Actions",
    "color": "cyan",
    "summary": "Toolbars replace the legacy ActionBar, providing a customizable top App Bar that hosts navigation icons, titles, and XML-inflated Options Menus.",
    "keyPoints": [
      "Use a NoActionBar theme and register your Toolbar in onCreate() using setSupportActionBar(toolbar).",
      "Create menu XML files inside res/menu/ (e.g., res/menu/main_menu.xml).",
      "Override onCreateOptionsMenu(menu: Menu?): Boolean to inflate the XML using menuInflater.inflate(R.menu.main_menu, menu).",
      "Override onOptionsItemSelected(item: MenuItem): Boolean and match item.itemId in a when expression."
    ],
    "apis": [
      {
        "name": "setSupportActionBar(toolbar)",
        "desc": "Binds an androidx.appcompat.widget.Toolbar to act as the Activity's ActionBar."
      },
      {
        "name": "onCreateOptionsMenu(menu)",
        "desc": "Lifecycle method where you inflate your menu resource and return true."
      },
      {
        "name": "onOptionsItemSelected(item)",
        "desc": "Triggered when a user taps any action icon or overflow menu item."
      },
      {
        "name": "app:showAsAction",
        "desc": "Controls whether an item appears as an icon on the bar (ifRoom, always) or inside the 3-dot overflow menu (never)."
      }
    ],
    "xmlCode": "<!-- 1. In res/menu/main_menu.xml -->\n<menu xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    xmlns:app=\"http://schemas.android.com/apk/res-auto\">\n\n    <item\n        android:id=\"@+id/action_search\"\n        android:icon=\"@android:drawable/ic_menu_search\"\n        android:title=\"Search\"\n        app:showAsAction=\"ifRoom\" />\n\n    <item\n        android:id=\"@+id/action_settings\"\n        android:title=\"Settings\"\n        app:showAsAction=\"never\" />\n\n    <item\n        android:id=\"@+id/action_logout\"\n        android:title=\"Logout\"\n        app:showAsAction=\"never\" />\n</menu>",
    "kotlinCode": "class MainActivity : AppCompatActivity() {\n\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n\n        val toolbar = findViewById<Toolbar>(R.id.toolbar)\n        setSupportActionBar(toolbar)\n        supportActionBar?.title = \"Dashboard\"\n    }\n\n    override fun onCreateOptionsMenu(menu: Menu?): Boolean {\n        menuInflater.inflate(R.menu.main_menu, menu)\n        return true\n    }\n\n    override fun onOptionsItemSelected(item: MenuItem): Boolean {\n        return when (item.itemId) {\n            R.id.action_search -> {\n                Toast.makeText(this, \"Search clicked\", Toast.LENGTH_SHORT).show()\n                true\n            }\n            R.id.action_settings -> {\n                Toast.makeText(this, \"Settings clicked\", Toast.LENGTH_SHORT).show()\n                true\n            }\n            else -> super.onOptionsItemSelected(item)\n        }\n    }\n}"
  },
  {
    "id": "sharedprefs",
    "title": "SharedPreferences",
    "badge": "Local Key-Value Storage",
    "color": "rose",
    "summary": "Persists lightweight primitive data (Strings, Ints, Booleans, Floats, Longs) as key-value pairs in an XML file inside the app's private storage.",
    "keyPoints": [
      "Ideal for user settings, login session flags, theme preferences, and high scores\u2014NOT for large relational datasets.",
      "Always open with Context.MODE_PRIVATE so other apps cannot read the preferences file.",
      "To write data, call sharedPrefs.edit(), chain putString() / putBoolean() / putInt(), and finish with apply() or commit().",
      "Prefer apply() over commit() because apply() saves asynchronously in the background without blocking the UI thread."
    ],
    "apis": [
      {
        "name": "getSharedPreferences(name, MODE_PRIVATE)",
        "desc": "Opens or creates a named SharedPreferences XML file."
      },
      {
        "name": "edit()",
        "desc": "Returns a SharedPreferences.Editor used to stage modifications."
      },
      {
        "name": "apply() vs commit()",
        "desc": "apply() writes asynchronously (non-blocking); commit() writes synchronously and returns a Boolean."
      },
      {
        "name": "remove(key) / clear()",
        "desc": "remove() deletes a single key; clear() wipes all keys in that preferences file."
      }
    ],
    "xmlCode": "<!-- Internal file generated by Android at:\n     /data/data/com.example.app/shared_prefs/UserPrefs.xml -->\n<?xml version='1.0' encoding='utf-8' standalone='yes' ?>\n<map>\n    <string name=\"KEY_USERNAME\">Hans</string>\n    <boolean name=\"KEY_DARK_MODE\" value=\"true\" />\n    <int name=\"KEY_HIGH_SCORE\" value=\"250\" />\n</map>",
    "kotlinCode": "val prefs = getSharedPreferences(\"UserPrefs\", Context.MODE_PRIVATE)\n\n// --- SAVING DATA ---\nbtnSave.setOnClickListener {\n    prefs.edit().apply {\n        putString(\"KEY_USERNAME\", etUsername.text.toString())\n        putBoolean(\"KEY_DARK_MODE\", switchDark.isChecked)\n        putInt(\"KEY_HIGH_SCORE\", 250)\n        apply() // Asynchronous save!\n    }\n    Toast.makeText(this, \"Preferences Saved!\", Toast.LENGTH_SHORT).show()\n}\n\n// --- LOADING DATA ---\nval savedUser = prefs.getString(\"KEY_USERNAME\", \"DefaultUser\")\nval isDark = prefs.getBoolean(\"KEY_DARK_MODE\", false)\nval highScore = prefs.getInt(\"KEY_HIGH_SCORE\", 0)\n\n// --- DELETING DATA ---\nbtnReset.setOnClickListener {\n    prefs.edit().clear().apply()\n}"
  }
];

const FLASHCARDS = [
  {
    "id": 1,
    "topic": "recyclerview",
    "topicName": "RecyclerView",
    "q": "What are the 3 mandatory methods you must override in a RecyclerView.Adapter?",
    "a": "1. onCreateViewHolder(parent, viewType)\n2. onBindViewHolder(holder, position)\n3. getItemCount()"
  },
  {
    "id": 2,
    "topic": "recyclerview",
    "topicName": "RecyclerView",
    "q": "What happens if you attach an Adapter to a RecyclerView but forget to set its LayoutManager?",
    "a": "The RecyclerView will render nothing (blank screen) and log 'E/RecyclerView: No layout manager attached; skipping layout'."
  },
  {
    "id": 3,
    "topic": "recyclerview",
    "topicName": "RecyclerView",
    "q": "Why should the 3rd parameter (attachToRoot) in LayoutInflater.inflate(R.layout.item, parent, false) be false inside onCreateViewHolder?",
    "a": "Because RecyclerView itself is responsible for attaching and detaching child item views at the right time via its LayoutManager."
  },
  {
    "id": 4,
    "topic": "recyclerview",
    "topicName": "RecyclerView",
    "q": "What is the role of the ViewHolder inside a RecyclerView?",
    "a": "It caches references to the child views (via findViewById or ViewBinding) for each item row so Android doesn't repeatedly call findViewById while scrolling."
  },
  {
    "id": 5,
    "topic": "checkbox",
    "topicName": "CheckBox",
    "q": "Which Kotlin property checks or changes whether a CheckBox is currently ticked?",
    "a": "checkBox.isChecked (returns or accepts a Boolean: true or false)."
  },
  {
    "id": 6,
    "topic": "checkbox",
    "topicName": "CheckBox",
    "q": "Which listener interface/method reacts immediately when a CheckBox is checked or unchecked?",
    "a": "setOnCheckedChangeListener { buttonView, isChecked -> ... }"
  },
  {
    "id": 7,
    "topic": "checkbox",
    "topicName": "CheckBox",
    "q": "How does CheckBox selection behavior differ from RadioButton?",
    "a": "CheckBoxes operate independently so users can select zero, one, or multiple options simultaneously."
  },
  {
    "id": 8,
    "topic": "checkbox",
    "topicName": "CheckBox",
    "q": "What method inverts a CheckBox's current state without explicitly passing true or false?",
    "a": "checkBox.toggle()"
  },
  {
    "id": 9,
    "topic": "radiobutton",
    "topicName": "RadioButton & RadioGroup",
    "q": "How do you enforce mutual exclusion among multiple RadioButtons in XML?",
    "a": "Wrap the <RadioButton> elements inside a parent <RadioGroup> container and give each RadioButton a unique android:id."
  },
  {
    "id": 10,
    "topic": "radiobutton",
    "topicName": "RadioButton & RadioGroup",
    "q": "What value does radioGroup.checkedRadioButtonId return if NO RadioButton is currently selected?",
    "a": "-1 (View.NO_ID)"
  },
  {
    "id": 11,
    "topic": "radiobutton",
    "topicName": "RadioButton & RadioGroup",
    "q": "How do you programmatically uncheck all RadioButtons inside a RadioGroup?",
    "a": "Call radioGroup.clearCheck()"
  },
  {
    "id": 12,
    "topic": "radiobutton",
    "topicName": "RadioButton & RadioGroup",
    "q": "Given the selected ID from radioGroup.checkedRadioButtonId, how do you get its displayed text?",
    "a": "val rb = findViewById<RadioButton>(selectedId)\nval text = rb.text.toString()"
  },
  {
    "id": 13,
    "topic": "spinner",
    "topicName": "Spinner",
    "q": "What happens when you call spinner.setOnClickListener { ... } on a Spinner?",
    "a": "Spinner throws a RuntimeException ('setOnClickListener cannot be used with a spinner'). You must use spinner.onItemSelectedListener instead."
  },
  {
    "id": 14,
    "topic": "spinner",
    "topicName": "Spinner",
    "q": "What two methods must be implemented in AdapterView.OnItemSelectedListener?",
    "a": "1. onItemSelected(parent, view, position, id)\n2. onNothingSelected(parent)"
  },
  {
    "id": 15,
    "topic": "spinner",
    "topicName": "Spinner",
    "q": "How do you retrieve the selected item's String inside onItemSelected()?",
    "a": "parent?.getItemAtPosition(position).toString()"
  },
  {
    "id": 16,
    "topic": "spinner",
    "topicName": "Spinner",
    "q": "Which ArrayAdapter method sets the layout used when the Spinner dropdown list is opened?",
    "a": "adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)"
  },
  {
    "id": 17,
    "topic": "switch",
    "topicName": "Switch",
    "q": "What parent class do CheckBox, RadioButton, and Switch all inherit from?",
    "a": "CompoundButton (which inherits from Button -> TextView -> View)."
  },
  {
    "id": 18,
    "topic": "switch",
    "topicName": "Switch",
    "q": "Why is SwitchCompat or MaterialSwitch preferred over the standard <Switch> tag?",
    "a": "They provide backward-compatible Material Design styling and consistent thumb/track tinting across older and newer Android versions."
  },
  {
    "id": 19,
    "topic": "switch",
    "topicName": "Switch",
    "q": "From a UX perspective, when should you use a Switch instead of a CheckBox?",
    "a": "Use a Switch for settings that take effect immediately (e.g., Dark Mode, Wi-Fi), and CheckBoxes when selections require clicking a 'Save/Submit' button."
  },
  {
    "id": 20,
    "topic": "switch",
    "topicName": "Switch",
    "q": "Which XML attributes customize the circle and bar colors of a MaterialSwitch?",
    "a": "app:thumbTint (the sliding circle) and app:trackTint (the background bar)."
  },
  {
    "id": 21,
    "topic": "intents",
    "topicName": "Passing Data (Intents)",
    "q": "How do you instantiate an Explicit Intent in Kotlin to open ProfileActivity?",
    "a": "val intent = Intent(this, ProfileActivity::class.java)"
  },
  {
    "id": 22,
    "topic": "intents",
    "topicName": "Passing Data (Intents)",
    "q": "Why does intent.getIntExtra(\"KEY_AGE\", 0) require a second argument while getStringExtra(\"KEY_NAME\") does not?",
    "a": "Int is a primitive type that cannot be null unless boxed, so Android requires a default fallback value (0) if the key is missing. String is nullable (String?)."
  },
  {
    "id": 23,
    "topic": "intents",
    "topicName": "Passing Data (Intents)",
    "q": "How do you pass a custom Kotlin data class object between Activities via an Intent?",
    "a": "Annotate the class with @Parcelize and implement Parcelable (or Serializable), then pass it with intent.putExtra(\"KEY\", obj)."
  },
  {
    "id": 24,
    "topic": "intents",
    "topicName": "Passing Data (Intents)",
    "q": "What happens if you try to start an Activity that is NOT declared in AndroidManifest.xml?",
    "a": "Your app crashes at runtime with ActivityNotFoundException."
  },
  {
    "id": 25,
    "topic": "menus",
    "topicName": "Menus & Toolbars",
    "q": "Which method connects an XML <Toolbar> widget to act as the Activity's official ActionBar?",
    "a": "setSupportActionBar(toolbar)"
  },
  {
    "id": 26,
    "topic": "menus",
    "topicName": "Menus & Toolbars",
    "q": "In which Activity callback do you inflate your res/menu/main_menu.xml resource?",
    "a": "override fun onCreateOptionsMenu(menu: Menu?): Boolean {\n    menuInflater.inflate(R.menu.main_menu, menu)\n    return true\n}"
  },
  {
    "id": 27,
    "topic": "menus",
    "topicName": "Menus & Toolbars",
    "q": "Which Activity callback handles clicks on Toolbar action icons and 3-dot overflow menu items?",
    "a": "override fun onOptionsItemSelected(item: MenuItem): Boolean"
  },
  {
    "id": 28,
    "topic": "menus",
    "topicName": "Menus & Toolbars",
    "q": "What is the difference between app:showAsAction=\"ifRoom\" and app:showAsAction=\"never\"?",
    "a": "'ifRoom' places the item as an icon directly on the Toolbar if space permits; 'never' forces the item inside the 3-dot overflow menu."
  },
  {
    "id": 29,
    "topic": "sharedprefs",
    "topicName": "SharedPreferences",
    "q": "What is the critical difference between editor.apply() and editor.commit() in SharedPreferences?",
    "a": "apply() writes changes asynchronously in the background without blocking the UI thread; commit() writes synchronously on the calling thread and returns a Boolean."
  },
  {
    "id": 30,
    "topic": "sharedprefs",
    "topicName": "SharedPreferences",
    "q": "What does Context.MODE_PRIVATE do when calling getSharedPreferences(\"Prefs\", Context.MODE_PRIVATE)?",
    "a": "It ensures the generated XML file can only be accessed by your application and is hidden from other apps."
  },
  {
    "id": 31,
    "topic": "sharedprefs",
    "topicName": "SharedPreferences",
    "q": "What happens if you call prefs.edit().putString(\"user\", \"Hans\") without calling apply() or commit()?",
    "a": "Nothing is saved! Staging methods on SharedPreferences.Editor only take effect when committed with apply() or commit()."
  },
  {
    "id": 32,
    "topic": "sharedprefs",
    "topicName": "SharedPreferences",
    "q": "What is the difference between editor.remove(\"KEY\") and editor.clear()?",
    "a": "remove(\"KEY\") deletes only that specific key-value pair, whereas clear() deletes all entries stored inside that SharedPreferences file."
  }
];

const QUIZ_QUESTIONS = [
  {
    "id": 1,
    "topic": "recyclerview",
    "topicName": "RecyclerView",
    "q": "Which RecyclerView.Adapter method is responsible for inflating the XML layout for an individual row and returning a ViewHolder?",
    "options": [
      "onBindViewHolder()",
      "onCreateViewHolder()",
      "getItemViewType()",
      "onAttachedToRecyclerView()"
    ],
    "answer": 1,
    "explanation": "onCreateViewHolder() uses LayoutInflater to inflate the item layout XML and wrap it inside a new ViewHolder instance."
  },
  {
    "id": 2,
    "topic": "recyclerview",
    "topicName": "RecyclerView",
    "q": "You set up a RecyclerView with a valid Adapter containing 20 items, but the screen stays completely blank without crashing. What is the most likely cause?",
    "options": [
      "You forgot to call notifyDataSetChanged() inside onCreate()",
      "You forgot to assign a LayoutManager (such as LinearLayoutManager) to the RecyclerView",
      "The item XML root layout used LinearLayout instead of ConstraintLayout",
      "getItemCount() returned 20 instead of 19"
    ],
    "answer": 1,
    "explanation": "Without a LayoutManager (e.g., rv.layoutManager = LinearLayoutManager(this)), RecyclerView cannot measure or position its items and skips layout entirely."
  },
  {
    "id": 3,
    "topic": "recyclerview",
    "topicName": "RecyclerView",
    "q": "Inside onCreateViewHolder(), why do we pass 'false' as the third argument in LayoutInflater.from(parent.context).inflate(R.layout.item_row, parent, false)?",
    "options": [
      "To disable click listeners on the root view",
      "So parent LayoutParams are respected without immediately adding the view to the RecyclerView before RecyclerView is ready",
      "To prevent ViewBinding from generating null references",
      "To force the RecyclerView into horizontal scrolling mode"
    ],
    "answer": 1,
    "explanation": "Passing parent gives the inflated view the proper LayoutParams, while attachToRoot = false lets RecyclerView manage when the view is attached."
  },
  {
    "id": 4,
    "topic": "checkbox",
    "topicName": "CheckBox",
    "q": "Which Kotlin snippet properly listens for state changes on a CheckBox named cbTerms?",
    "options": [
      "cbTerms.setOnItemSelectedListener { _, isChecked -> }",
      "cbTerms.setOnCheckedChangeListener { _, isChecked -> }",
      "cbTerms.onCheckChanged { isChecked -> }",
      "cbTerms.setOnToggleListener { isChecked -> }"
    ],
    "answer": 1,
    "explanation": "CompoundButton subclasses (CheckBox, RadioButton, Switch) use setOnCheckedChangeListener { buttonView, isChecked -> ... }."
  },
  {
    "id": 5,
    "topic": "checkbox",
    "topicName": "CheckBox",
    "q": "How can you invert the state of a CheckBox in Kotlin without using an if/else statement?",
    "options": [
      "cbOption.invert()",
      "cbOption.reverse()",
      "cbOption.toggle()",
      "cbOption.switchState()"
    ],
    "answer": 2,
    "explanation": "CompoundButton provides the toggle() method, which flips isChecked from true to false or false to true."
  },
  {
    "id": 6,
    "topic": "checkbox",
    "topicName": "CheckBox",
    "q": "Which XML attribute makes a CheckBox checked by default when the Activity first loads?",
    "options": [
      "android:selected=\"true\"",
      "android:checked=\"true\"",
      "android:state_checked=\"true\"",
      "app:isChecked=\"true\""
    ],
    "answer": 1,
    "explanation": "android:checked=\"true\" sets the initial checked state of CheckBox, RadioButton, and Switch widgets in XML."
  },
  {
    "id": 7,
    "topic": "radiobutton",
    "topicName": "RadioButton & RadioGroup",
    "q": "What happens if you place three <RadioButton> widgets inside a <LinearLayout> instead of a <RadioGroup>?",
    "options": [
      "The app crashes with a ClassCastException on startup",
      "Only the first RadioButton will be clickable",
      "Users will be able to check all three RadioButtons at the same time (no mutual exclusion)",
      "Android Studio refuses to compile the layout XML"
    ],
    "answer": 2,
    "explanation": "RadioGroup is what enforces single-selection mutual exclusion. Outside a RadioGroup, each RadioButton acts independently once checked."
  },
  {
    "id": 8,
    "topic": "radiobutton",
    "topicName": "RadioButton & RadioGroup",
    "q": "If no RadioButton is selected inside rgGender, what does rgGender.checkedRadioButtonId return?",
    "options": [
      "0",
      "null",
      "-1",
      "Throws NoSuchElementException"
    ],
    "answer": 2,
    "explanation": "checkedRadioButtonId returns -1 (View.NO_ID) when no RadioButton is currently checked."
  },
  {
    "id": 9,
    "topic": "radiobutton",
    "topicName": "RadioButton & RadioGroup",
    "q": "Which method resets a RadioGroup so that none of its RadioButtons are selected?",
    "options": [
      "radioGroup.reset()",
      "radioGroup.uncheckAll()",
      "radioGroup.clearCheck()",
      "radioGroup.checkedRadioButtonId = -1"
    ],
    "answer": 2,
    "explanation": "radioGroup.clearCheck() clears the current selection in the group."
  },
  {
    "id": 10,
    "topic": "spinner",
    "topicName": "Spinner",
    "q": "What happens at runtime if you execute spinner.setOnClickListener { ... }?",
    "options": [
      "It triggers whenever the user opens the dropdown",
      "It triggers when the first item is selected",
      "It throws a RuntimeException because setOnClickListener is not supported on Spinner",
      "It silently ignores the click"
    ],
    "answer": 2,
    "explanation": "AdapterView (and Spinner) explicitly throws a RuntimeException if you call setOnClickListener. Always use onItemSelectedListener."
  },
  {
    "id": 11,
    "topic": "spinner",
    "topicName": "Spinner",
    "q": "Inside onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long), how do you get the selected item?",
    "options": [
      "view?.text.toString()",
      "parent?.getItemAtPosition(position).toString()",
      "parent?.getSelectedItem(id)",
      "spinner.getTextAt(position)"
    ],
    "answer": 1,
    "explanation": "parent?.getItemAtPosition(position) returns the data object bound at that index in the Spinner's Adapter."
  },
  {
    "id": 12,
    "topic": "spinner",
    "topicName": "Spinner",
    "q": "Which method on ArrayAdapter specifies the layout used for the rows when the Spinner popup list is expanded?",
    "options": [
      "adapter.setPopupLayoutResource()",
      "adapter.setDropDownViewResource()",
      "adapter.setExpandedItemLayout()",
      "adapter.inflateDropDown()"
    ],
    "answer": 1,
    "explanation": "setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item) sets the layout for dropdown rows."
  },
  {
    "id": 13,
    "topic": "switch",
    "topicName": "Switch",
    "q": "Which property do you read to check whether a Switch / MaterialSwitch is currently turned ON?",
    "options": [
      "switchWidget.isOn",
      "switchWidget.isToggled",
      "switchWidget.isChecked",
      "switchWidget.isSelected"
    ],
    "answer": 2,
    "explanation": "Because Switch extends CompoundButton, it uses the standard isChecked Boolean property."
  },
  {
    "id": 14,
    "topic": "switch",
    "topicName": "Switch",
    "q": "When a user slides a MaterialSwitch from OFF to ON, what are the parameters passed to setOnCheckedChangeListener?",
    "options": [
      "(view: View, state: Int)",
      "(buttonView: CompoundButton, isChecked: Boolean)",
      "(switch: MaterialSwitch, isOn: Boolean, position: Int)",
      "(isChecked: Boolean)"
    ],
    "answer": 1,
    "explanation": "CompoundButton.OnCheckedChangeListener passes (buttonView: CompoundButton, isChecked: Boolean)."
  },
  {
    "id": 15,
    "topic": "switch",
    "topicName": "Switch",
    "q": "Which component from the Material Components library is recommended for modern Material 3 Android apps?",
    "options": [
      "android.widget.ToggleButton",
      "com.google.android.material.materialswitch.MaterialSwitch",
      "android.widget.SlidingSwitch",
      "androidx.recyclerview.widget.SwitchView"
    ],
    "answer": 1,
    "explanation": "MaterialSwitch is the official Material 3 toggle switch widget."
  },
  {
    "id": 16,
    "topic": "intents",
    "topicName": "Passing Data (Intents)",
    "q": "Which Kotlin syntax properly creates an Explicit Intent from MainActivity to DetailsActivity?",
    "options": [
      "Intent(this, DetailsActivity.class)",
      "Intent(this, DetailsActivity::class.java)",
      "Intent.create(MainActivity, DetailsActivity)",
      "Intent(\"DetailsActivity\")"
    ],
    "answer": 1,
    "explanation": "In Kotlin, you obtain the Java Class reference required by the Intent constructor using TargetActivity::class.java."
  },
  {
    "id": 17,
    "topic": "intents",
    "topicName": "Passing Data (Intents)",
    "q": "In MainActivity you call intent.putExtra(\"POINTS\", 150). How should SecondActivity retrieve this value?",
    "options": [
      "intent.getIntExtra(\"POINTS\")",
      "intent.getIntExtra(\"POINTS\", 0)",
      "intent.getStringExtra(\"POINTS\").toInt()",
      "Bundle.getInt(\"POINTS\")"
    ],
    "answer": 1,
    "explanation": "getIntExtra(name, defaultValue) requires a fallback Int value in case the key was not provided."
  },
  {
    "id": 18,
    "topic": "intents",
    "topicName": "Passing Data (Intents)",
    "q": "What happens if you pass an Int with putExtra(\"AGE\", 20) and try to read it in the next Activity using intent.getStringExtra(\"AGE\")?",
    "options": [
      "It automatically converts 20 to \"20\"",
      "It returns null (and logs a type mismatch warning in Logcat)",
      "It returns \"0\"",
      "It fails to compile in Android Studio"
    ],
    "answer": 1,
    "explanation": "Bundle type mismatches return null (for object getters like getStringExtra) and print a warning in Logcat."
  },
  {
    "id": 19,
    "topic": "menus",
    "topicName": "Menus & Toolbars",
    "q": "To use an <androidx.appcompat.widget.Toolbar> as your Activity's ActionBar, what method must you call in onCreate()?",
    "options": [
      "registerToolbar(toolbar)",
      "setActionBarView(toolbar)",
      "setSupportActionBar(toolbar)",
      "toolbar.attachToActivity(this)"
    ],
    "answer": 2,
    "explanation": "AppCompatActivity provides setSupportActionBar(toolbar) to designate a Toolbar widget as the Activity app bar."
  },
  {
    "id": 20,
    "topic": "menus",
    "topicName": "Menus & Toolbars",
    "q": "Inside onCreateOptionsMenu(menu: Menu?): Boolean, which line inflates res/menu/top_menu.xml into the Toolbar?",
    "options": [
      "LayoutInflater.from(this).inflate(R.menu.top_menu, menu)",
      "menuInflater.inflate(R.menu.top_menu, menu)",
      "menu?.loadResource(R.menu.top_menu)",
      "supportActionBar?.inflateMenu(R.menu.top_menu)"
    ],
    "answer": 1,
    "explanation": "menuInflater.inflate(R.menu.top_menu, menu) parses the menu XML resource into the Menu object."
  },
  {
    "id": 21,
    "topic": "menus",
    "topicName": "Menus & Toolbars",
    "q": "When handling a menu click inside onOptionsItemSelected(item: MenuItem): Boolean, what should your function return after consuming the click event?",
    "options": [
      "true",
      "false",
      "item.itemId",
      "Unit"
    ],
    "answer": 0,
    "explanation": "Returning true signals to Android that the menu item click has been successfully handled."
  },
  {
    "id": 22,
    "topic": "sharedprefs",
    "topicName": "SharedPreferences",
    "q": "Why does Android Studio recommend calling editor.apply() instead of editor.commit() when saving SharedPreferences?",
    "options": [
      "apply() encrypts the XML file automatically while commit() does not",
      "apply() updates memory immediately and writes to disk asynchronously without blocking the main UI thread",
      "commit() cannot save Boolean or Float values",
      "apply() saves data to cloud storage automatically"
    ],
    "answer": 1,
    "explanation": "commit() performs synchronous disk I/O on the calling thread (which can freeze the UI), whereas apply() writes to disk asynchronously."
  },
  {
    "id": 23,
    "topic": "sharedprefs",
    "topicName": "SharedPreferences",
    "q": "What does the following code do?\nval prefs = getSharedPreferences(\"AppPrefs\", Context.MODE_PRIVATE)\nprefs.edit().putString(\"TOKEN\", \"abc123\")",
    "options": [
      "It saves \"abc123\" under the key \"TOKEN\" immediately",
      "It throws an IllegalStateException",
      "It does NOT persist anything to disk because apply() or commit() was never called",
      "It deletes the \"AppPrefs\" file"
    ],
    "answer": 2,
    "explanation": "Calling putString() on an Editor only stages the change. Without .apply() or .commit(), the change is discarded."
  },
  {
    "id": 24,
    "topic": "sharedprefs",
    "topicName": "SharedPreferences",
    "q": "Where are SharedPreferences files physically stored on an Android device?",
    "options": [
      "In the public Downloads folder as a .json file",
      "Inside the app's private internal storage directory as an XML file (/data/data/<package>/shared_prefs/)",
      "Inside AndroidManifest.xml",
      "Inside a SQLite Room table automatically"
    ],
    "answer": 1,
    "explanation": "SharedPreferences stores key-value pairs inside an XML file located in the app's private data directory."
  }
];

const SYNTAX_MATCH_PAIRS = [
  {
    "id": "m1",
    "task": "Inflate row XML in RecyclerView.Adapter",
    "code": "onCreateViewHolder(parent, viewType)"
  },
  {
    "id": "m2",
    "task": "Bind list item data to ViewHolder views",
    "code": "onBindViewHolder(holder, position)"
  },
  {
    "id": "m3",
    "task": "Check or set CheckBox / Switch state",
    "code": "widget.isChecked"
  },
  {
    "id": "m4",
    "task": "Flip CheckBox state (true <-> false)",
    "code": "checkBox.toggle()"
  },
  {
    "id": "m5",
    "task": "Get selected RadioButton ID in RadioGroup",
    "code": "radioGroup.checkedRadioButtonId"
  },
  {
    "id": "m6",
    "task": "Uncheck all options in a RadioGroup",
    "code": "radioGroup.clearCheck()"
  },
  {
    "id": "m7",
    "task": "Set layout for open Spinner dropdown rows",
    "code": "adapter.setDropDownViewResource(...)"
  },
  {
    "id": "m8",
    "task": "Read chosen Spinner item inside callback",
    "code": "parent?.getItemAtPosition(position)"
  },
  {
    "id": "m9",
    "task": "Create Explicit Intent to SecondActivity",
    "code": "Intent(this, SecondActivity::class.java)"
  },
  {
    "id": "m10",
    "task": "Attach key-value data to an Intent",
    "code": "intent.putExtra(\"KEY\", value)"
  },
  {
    "id": "m11",
    "task": "Read Int extra with fallback default",
    "code": "intent.getIntExtra(\"KEY\", 0)"
  },
  {
    "id": "m12",
    "task": "Bind custom Toolbar as Activity ActionBar",
    "code": "setSupportActionBar(toolbar)"
  },
  {
    "id": "m13",
    "task": "Inflate res/menu XML inside Activity",
    "code": "menuInflater.inflate(R.menu.main, menu)"
  },
  {
    "id": "m14",
    "task": "Handle Toolbar action item clicks",
    "code": "onOptionsItemSelected(item: MenuItem)"
  },
  {
    "id": "m15",
    "task": "Save SharedPreferences asynchronously",
    "code": "prefs.edit().putString(...).apply()"
  },
  {
    "id": "m16",
    "task": "Open private SharedPreferences file",
    "code": "getSharedPreferences(\"Prefs\", MODE_PRIVATE)"
  }
];
