from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import inch
import tempfile
import os
import string

def generate_omr_sheet(school_name, exam_name, subjects, questions_per_subject=25, num_options=4, logo_path=None):
    """
    Generate a professional OMR answer sheet PDF with automatic scaling
    
    Args:
        school_name: Name of the school/institution
        exam_name: Name of the exam
        subjects: List of subject names
        questions_per_subject: Number of questions per subject
        num_options: Number of answer options (A, B, C, D, etc.)
        logo_path: Path to logo image file (optional)
    
    Returns:
        Path to generated PDF file
    """
    
    # Create temporary file for PDF
    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    output_path = temp_pdf.name
    temp_pdf.close()
    
    # Create canvas
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    
    # Draw border/frame
    c.setLineWidth(2)
    c.rect(20, 20, width-40, height-40)
    
    # Insert Logo if provided
    if logo_path and os.path.exists(logo_path):
        try:
            logo = ImageReader(logo_path)
            c.drawImage(logo, 40, height-110, 70, 70, mask='auto')
        except Exception as e:
            print(f"Warning: Could not load logo: {e}")
    
    # Title and Subtitles
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width/2, height-50, school_name.upper())
    c.setFont("Helvetica", 12)
    c.drawCentredString(width/2, height-75, f"ANSWER SHEET - {exam_name.upper()}")
    
    # Roll No. and Booklet No. boxes
    c.rect(width-220, height-100, 180, 30)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(width-215, height-85, "ROLL NO.")
    
    c.rect(width-220, height-140, 180, 30)
    c.drawString(width-215, height-125, "TEST BOOKLET NUMBER")
    
    # Column headers - dynamically adjust based on number of subjects
    num_subjects = len(subjects)
    col_width = (width-120) / num_subjects
    start_y = height-160
    c.setFont("Helvetica-Bold", 12)
    for i, subject in enumerate(subjects):
        x = 50 + i*col_width + col_width/2
        c.drawCentredString(x, start_y, subject.upper())
    
    # Generate answer options
    options = list(string.ascii_uppercase[:num_options])
    
    # Auto row height scaling based on number of questions
    available_height = start_y - 180   # space available for questions
    row_height = available_height / questions_per_subject
    bubble_radius = min(6, row_height/3)  # keep bubbles proportional
    
    # Draw bubbles for each subject
    for col in range(num_subjects):
        x_offset = 50 + col*col_width
        bubble_spacing = (col_width - 80) / len(options)  # even spacing
        
        for q in range(questions_per_subject):
            y = start_y - (q+1)*row_height
            q_no = f"{q+1:02d}"
            
            # Right-aligned question number
            c.setFont("Helvetica", 9)
            c.drawRightString(x_offset + 35, y, q_no)
            
            # Draw bubbles with options inside
            for i, option in enumerate(options):
                bubble_x = x_offset + 50 + i * bubble_spacing
                bubble_y = y + 3
                c.circle(bubble_x, bubble_y, bubble_radius, stroke=1, fill=0)
                c.setFont("Helvetica-Bold", 7)
                # Center the text inside the bubble
                c.drawCentredString(bubble_x, bubble_y - 2.5, option)
    
    # Declaration section
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 140, "DECLARATION BY THE CANDIDATE")
    c.setFont("Helvetica", 9)
    c.drawString(50, 125, "I declare that I have answered the questions with my own hand.")
    
    # Candidate details boxes
    c.rect(50, 90, 200, 30)
    c.drawString(55, 105, "CANDIDATE'S NAME")
    
    c.rect(270, 90, 200, 30)
    c.drawString(275, 105, "CLASS/SECTION")
    
    c.rect(50, 50, 200, 30)
    c.drawString(55, 65, "CANDIDATE'S SIGNATURE")
    
    c.rect(270, 50, 200, 30)
    c.drawString(275, 65, "INVIGILATOR SIGN")
    
    # Save PDF
    c.save()
    
    return output_path
