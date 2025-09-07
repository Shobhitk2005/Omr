from flask import render_template, request, send_file, flash, redirect, url_for
from app import app
from omr_generator import generate_omr_sheet
import os
import tempfile
import logging

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        # Get form data with validation
        school_name = request.form.get('school_name', '').strip()
        exam_name = request.form.get('exam_name', '').strip()
        
        # Validate required fields
        if not school_name:
            flash('School name is required', 'error')
            return redirect(url_for('index'))
        
        if not exam_name:
            flash('Exam name is required', 'error')
            return redirect(url_for('index'))
        
        # Get subjects (split by comma and clean)
        subjects_input = request.form.get('subjects', '').strip()
        if not subjects_input:
            flash('At least one subject is required', 'error')
            return redirect(url_for('index'))
        
        subjects = [s.strip().upper() for s in subjects_input.split(',') if s.strip()]
        
        if len(subjects) > 5:
            flash('Maximum 5 subjects allowed', 'error')
            return redirect(url_for('index'))
        
        # Get questions per subject
        try:
            questions_per_subject = int(request.form.get('questions_per_subject', 25))
            if questions_per_subject < 1 or questions_per_subject > 100:
                flash('Questions per subject must be between 1 and 100', 'error')
                return redirect(url_for('index'))
        except ValueError:
            flash('Invalid number of questions', 'error')
            return redirect(url_for('index'))
        
        # Get number of options
        try:
            num_options = int(request.form.get('num_options', 4))
            if num_options < 2 or num_options > 6:
                flash('Number of options must be between 2 and 6', 'error')
                return redirect(url_for('index'))
        except ValueError:
            flash('Invalid number of options', 'error')
            return redirect(url_for('index'))
        
        # Handle logo upload
        logo_path = None
        if 'logo' in request.files:
            logo_file = request.files['logo']
            if logo_file.filename:
                if not logo_file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    flash('Logo must be a PNG, JPG, JPEG, or GIF file', 'error')
                    return redirect(url_for('index'))
                
                # Save logo to temporary file
                temp_logo = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(logo_file.filename)[1])
                logo_file.save(temp_logo.name)
                logo_path = temp_logo.name
        
        # Generate PDF
        pdf_path = generate_omr_sheet(
            school_name=school_name,
            exam_name=exam_name,
            subjects=subjects,
            questions_per_subject=questions_per_subject,
            num_options=num_options,
            logo_path=logo_path
        )
        
        # Clean up temporary logo file
        if logo_path and os.path.exists(logo_path):
            try:
                os.unlink(logo_path)
            except:
                pass
        
        # Send file and clean up
        def cleanup_pdf():
            try:
                os.unlink(pdf_path)
            except:
                pass
        
        return send_file(
            pdf_path,
            as_attachment=True,
            download_name=f"{school_name.replace(' ', '_')}_OMR_Sheet.pdf",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        logging.error(f"Error generating OMR sheet: {str(e)}")
        flash('An error occurred while generating the OMR sheet. Please try again.', 'error')
        return redirect(url_for('index'))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    logging.error(f"Internal server error: {str(e)}")
    flash('An internal error occurred. Please try again.', 'error')
    return render_template('index.html'), 500
