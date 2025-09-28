#!/bin/bash

# Function to display the main menu
show_menu() {
    echo "========================================="
    echo "   🚀 Advanced Build System Manager   "
    echo "========================================="
    echo "What would you like to do?"
    echo ""
    PS3="👉 Please enter your choice: "
    options=(
        "Install Dependencies"
        "Run Development Build"
        "Run Production Build"
        "Start Development Watch Mode"
        "Clean Project"
        "Re-run Initial File Setup"
        "Exit"
    )
    select opt in "${options[@]}"
    do
        case $opt in
            "Install Dependencies")
                echo "📦 Installing dependencies..."
                npm install
                echo "✅ All dependencies installed."
                break
                ;;
            "Run Development Build")
                echo "🛠️  Running development build..."
                npm run build
                break
                ;;
            "Run Production Build")
                echo "🏭 Running production build..."
                npm run build:production
                break
                ;;
            "Start Development Watch Mode")
                echo "👀 Starting development watch mode... (Press Ctrl+C to stop)"
                npm run dev
                break
                ;;
            "Clean Project")
                echo "🧹 Cleaning project..."
                npm run clean
                echo "✅ Project cleaned."
                break
                ;;
            "Re-run Initial File Setup")
                echo "🔄 Re-running initial project setup..."
                initial_setup
                echo "✅ File setup complete. Please choose 'Install Dependencies' if you haven't already."
                break
                ;;
            "Exit")
                echo "👋 Goodbye!"
                exit 0
                ;;
            *) echo "❌ Invalid option $REPLY";;
        esac
    done
}

# Function for the initial setup of files and directories
initial_setup() {
    echo "🚀 Setting up Advanced Build System files..."
    echo ""
    
    # Create directories
    echo "📁 Creating directories..."
    mkdir -p css js
    
    # Create CSS files
    echo "🎨 Creating CSS files..."
    # (The content of your css files is placed here)
cat > css/styles.css << 'EOF'
# Fill it with your styles.css

EOF
cat > css/vendor.css << 'EOF'
# Fill it with your vendor.css
EOF

    # Create JS files
    echo "⚡ Creating JavaScript files..."
    # (The content of your js files is placed here)
cat > js/main.js << 'EOF'
# Fill it with your main.js

EOF
cat > js/plugins.js << 'EOF'
# Fill it with your plugins.js

EOF

    # Create HTML source file
    echo "🌐 Creating HTML source file (index.source.html)..."

    cat > index.html << 'EOF'
# Fill it with your index.html

EOF

    echo ""
    echo "✅ File and directory setup completed successfully!"
}

# --- Main Script Logic ---

# Check if it's the first run by looking for a key file
if [ ! -f "index.source.html" ]; then
    initial_setup
    echo ""
    echo "🎯 First-time setup complete!"
    echo "   Next, choose 'Install Dependencies' from the menu to get started."
    echo ""
fi

# Loop to show the menu until the user exits
while true; do
    show_menu
done
