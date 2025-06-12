import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

# Configuration
QR_CONFIG = {
    # 'version': 1,
    'error_correction': qrcode.constants.ERROR_CORRECT_H,
    'box_size': 30,
    'border': 4,
    'data_pattern': "{num:02}",
    'fill_color': "black",
    'back_color': "white",
    'output_size': (1000, 1200),
    'font_size': 60
}

def generate_qr_codes():
    # Create output directory
    os.makedirs("qr_codes", exist_ok=True)
    
    for i in range(65, 91):
        # Generate QR code
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=30,
            border=4
        )
        qr.add_data(chr(i))
        qr.make(fit=True)
        
        # Create base QR image
        qr_img = qr.make_image(
            fill_color=QR_CONFIG['fill_color'],
            back_color=QR_CONFIG['back_color']
        )

        # Save image
        output_path = f"qr_codes/{chr(i)}.png"
        qr_img.save(output_path)
        print(f"Successfully generated {output_path}")

if __name__ == "__main__":
    generate_qr_codes()
    print("All QR codes generated successfully!")
