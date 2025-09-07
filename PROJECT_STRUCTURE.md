# Little Flower OMR Generator - Project Structure

## Overview
Professional OMR (Optical Mark Recognition) answer sheet generator web application designed by **Afzal Moin** for Little Flower School and NEET/JEE examinations.

## Project Structure
```
├── main.py                 # Application entry point
├── app.py                  # Flask application initialization
├── routes.py              # Web routes and request handling
├── omr_generator.py       # PDF generation logic using ReportLab
├── Procfile              # Heroku deployment configuration
├── pyproject.toml        # Python dependencies (modern format)
├── templates/            # Jinja2 HTML templates
│   ├── base.html         # Base template with navigation and branding
│   └── index.html        # Main form interface
├── static/               # Static assets
│   ├── css/
│   │   └── custom.css    # Custom styling with gradients and branding
│   └── js/
│       └── app.js        # Frontend JavaScript for form validation and templates
└── attached_assets/      # User uploaded files and temporary storage
```

## Key Features
- **Continuous Question Numbering**: Questions numbered 1-180 across all subjects
- **NEET Support**: Physics, Chemistry, Botany, Zoology with 45 questions each
- **JEE Support**: Physics, Chemistry, Mathematics with 25 questions each  
- **Quick Templates**: One-click setup for common exam formats
- **Logo Upload**: Institution branding support
- **Professional Design**: Clean, scannable OMR sheets with proper spacing
- **Responsive UI**: Bootstrap-based interface with dark theme

## Technical Stack
- **Backend**: Flask (Python web framework)
- **PDF Generation**: ReportLab library
- **Frontend**: Bootstrap 5 with custom CSS
- **Database**: PostgreSQL (via Flask-SQLAlchemy)
- **Deployment**: Gunicorn WSGI server

## Deployment Files
- `Procfile`: Heroku deployment configuration
- `pyproject.toml`: Modern Python dependency management
- `main.py`: Entry point for WSGI servers

## Branding
- **Developer**: Afzal Moin
- **Institution**: Little Flower School
- **Address**: JB Complex, College Road, Nalbari

## Key Customizations
- APAAR ID instead of Roll Number
- Separate Botany/Zoology subjects for NEET
- Continuous numbering across subjects
- Professional candidate information section
- Coaching address integration