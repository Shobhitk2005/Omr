# Overview

This is a Flask-based web application that generates professional OMR (Optical Mark Recognition) answer sheets in PDF format. The application allows educational institutions to create customizable answer sheets for various examinations with features like custom school names, exam titles, subject configurations, and adjustable question counts. The system uses ReportLab for PDF generation and provides a responsive web interface for easy sheet creation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Template Engine**: Jinja2 templating with Flask
- **UI Framework**: Bootstrap with dark theme optimized for Replit
- **Client-side Enhancement**: Vanilla JavaScript for form validation and real-time preview
- **Responsive Design**: Mobile-friendly interface with Bootstrap grid system

## Backend Architecture
- **Web Framework**: Flask with modular route organization
- **PDF Generation**: ReportLab library for creating professional OMR sheets
- **File Handling**: Temporary file system for PDF generation and delivery
- **Session Management**: Flask sessions with configurable secret key
- **Logging**: Python logging module with debug-level configuration

## Data Flow
- **Input Validation**: Server-side validation for form parameters including subject limits, question counts, and required fields
- **PDF Generation Pipeline**: Dynamic sheet creation based on user parameters with customizable layouts
- **File Delivery**: Temporary file creation and cleanup for PDF downloads

## Configuration Management
- **Environment Variables**: Session secrets and configuration via environment variables
- **Customizable Parameters**: Questions per subject (1-100), number of options (2-6), and subject count (max 5)
- **Layout Flexibility**: Support for logo integration and dynamic content positioning

# External Dependencies

## Core Libraries
- **Flask**: Web framework for routing and templating
- **ReportLab**: PDF generation library for creating OMR sheets with precise layout control
- **Werkzeug**: WSGI utilities bundled with Flask

## Frontend Assets
- **Bootstrap CSS**: UI framework loaded via CDN with custom dark theme
- **Font Awesome**: Icon library for enhanced user interface
- **Custom CSS/JS**: Local stylesheets and JavaScript for application-specific functionality

## Development Tools
- **Python Logging**: Built-in logging for debugging and monitoring
- **Tempfile Module**: Temporary file management for PDF generation
- **OS Module**: Environment variable handling and file system operations

## Optional Integrations
- **Logo Support**: Image file upload and integration capability for institutional branding
- **File Upload**: Multi-part form support for logo image uploads