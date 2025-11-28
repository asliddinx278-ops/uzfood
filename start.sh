#!/bin/bash
# Quick Start Script for Taxi Management System (Linux/Mac)

echo ""
echo "========================================"
echo "  Taxi Management System - Start"
echo "========================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not found!"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "✓ Python found"

# Check dependencies
echo ""
echo "Checking dependencies..."
if ! pip3 show flask &> /dev/null; then
    echo ""
    echo "✗ Dependencies not installed!"
    echo ""
    echo "Run:"
    echo "   pip3 install -r requirements.txt"
    echo ""
    exit 1
fi

echo "✓ All dependencies installed"

# Check .env file
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✓ .env file created - please update with your settings"
fi

# Initialize system
echo ""
echo "Initializing system..."
python3 init_system.py

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: System initialization failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "  System ready! Open 3 terminals:"
echo "========================================"
echo ""
echo "Terminal 1 (WEB SERVER):"
echo "  python3 app.py"
echo ""
echo "Terminal 2 (ADMIN PANEL):"
echo "  python3 admin_panel.py"
echo ""
echo "Terminal 3 (DISPATCHER PANEL):"
echo "  python3 dispatcher_panel.py"
echo ""
echo "Health Check:"
echo "  curl http://localhost:5000/health"
echo ""
