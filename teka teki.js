/**
 * Simple image-based captcha generator using canvas.
 * Generates a random text and draws it on canvas with noise.
 */

function generateRandomText(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let text = '';
  for (let i = 0; i < length; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

function drawCaptcha(text, canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Fill background
  ctx.fillStyle = '#FFF8E1';
  ctx.fillRect(0, 0, width, height);

  // Draw noise lines
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = '#d2b48c';
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  // Draw text
  ctx.font = '28px Poppins, sans-serif';
  ctx.fillStyle = '#4B2E05';
  ctx.textBaseline = 'middle';
  const textWidth = ctx.measureText(text).width;
  const x = (width - textWidth) / 2;
  const y = height / 2;
  ctx.fillText(text, x, y);

  // Draw noise dots
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = '#d2b48c';
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, 1.5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export class Captcha {
  constructor(imageId, inputId, messageId) {
    this.image = document.getElementById(imageId);
    this.input = document.getElementById(inputId);
    this.message = document.getElementById(messageId);
    this.captchas = [
      { src: 'images/teka teki.png', answer: '281737' }
    ];
    this.currentCaptcha = null;
  }

  generate() {
    const index = Math.floor(Math.random() * this.captchas.length);
    this.currentCaptcha = this.captchas[index];
    console.log('Captcha image element:', this.image);
    console.log('Setting captcha image src to:', this.currentCaptcha.src);
    if (this.image.tagName.toLowerCase() === 'img') {
      this.image.src = this.currentCaptcha.src;
    } else if (this.image.tagName.toLowerCase() === 'canvas') {
      drawCaptcha(this.currentCaptcha.answer, this.image);
    }
    this.input.value = '';
    this.message.textContent = '';
  }

  validate() {
    if (this.input.value.trim().toUpperCase() === this.currentCaptcha.answer.toUpperCase()) {
      this.message.style.color = 'green';
      this.message.textContent = 'Permintaan reset berhasil.';
      setTimeout(() => {
        window.location.href = 'reset_password.html';
      }, 2000);
      return true;
    } else {
      this.message.style.color = 'red';
      this.message.textContent = 'Permintaan reset gagal. Silakan coba lagi.';
      this.generate();
      return false;
    }
  }
}
