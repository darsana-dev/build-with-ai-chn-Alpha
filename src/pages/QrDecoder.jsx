import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, QrCode, Link, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import jsQR from 'jsqr';
import { addThreatLog } from '../utils/threatLog';

const QrDecoder = () => {
  const [image, setImage] = useState(null);
  const [payload, setPayload] = useState(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file format (.png, .jpg, .jpeg)');
      return;
    }
    
    setError(null);
    setImage(URL.createObjectURL(file));
    setPayload(null);
    setIsDecoding(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        setTimeout(() => {
          setIsDecoding(false);
          if (code) {
            analyzePayload(code.data);
          } else {
            setError('Could not establish a readable QR structure in the image provided.');
          }
        }, 800); // UI delay trick
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  const analyzePayload = (data) => {
    // Determine if it is a url
    const isUrl = data.startsWith('http://') || data.startsWith('https://');
    const isDangerous = data.includes('malware') || data.includes('test') || data.includes('phish');
    
    const result = {
      raw: data,
      type: isUrl ? 'URL' : 'Text',
      isDangerous: isUrl && isDangerous
    };
    
    setPayload(result);
    
    addThreatLog({
      type: 'QR_DECODED',
      target: isUrl ? new URL(data).hostname : 'Raw Text',
      status: result.isDangerous ? 'Malicious' : 'Clean',
      details: `Payload Type: ${result.type}.`
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="page-header">
        <h1 className="page-title">QR Code Payload Decoder</h1>
        <p className="page-subtitle">Extract and safely preview hidden payloads within suspicious QR codes.</p>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div 
            className="glass-panel" 
            style={{ 
              padding: '40px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderStyle: 'dashed',
              borderWidth: '2px',
              borderColor: 'var(--border-light)',
              cursor: 'pointer',
              height: '350px',
              transition: 'all 0.3s'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('qr-upload').click()}
          >
            <input 
              type="file" 
              id="qr-upload" 
              accept="image/*"
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            
            {image ? (
              <img src={image} alt="QR Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
            ) : (
              <>
                <QrCode size={64} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
                <h3>Drop QR code image here</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Supports PNG, JPG, JPEG</p>
              </>
            )}
          </div>
          
          {error && (
            <div style={{ marginTop: '16px', color: 'var(--accent-red)', background: 'rgba(255, 59, 59, 0.1)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} /> {error}
            </div>
          )}
        </div>

        <div style={{ flex: '1', minWidth: '300px' }}>
          {isDecoding ? (
             <div className="glass-panel" style={{ height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <Search className="animate-pulse-glow" size={48} color="var(--accent-cyan)" style={{ borderRadius: '50%' }} />
                <h3 style={{ color: 'var(--accent-cyan)' }}>Extracting Payload...</h3>
             </div>
          ) : payload ? (
            <div className="glass-panel animate-fade-in" style={{ height: '350px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Payload Extracted <CheckCircle size={20} color="var(--accent-green)" />
              </h3>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)', flex: 1, overflowY: 'auto' }}>
                 <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   {payload.type === 'URL' ? <Link size={16} /> : <QrCode size={16} />} Detected Type: {payload.type}
                 </div>
                 
                 <div style={{ fontSize: '1.2rem', wordBreak: 'break-all', fontFamily: 'monospace', color: '#fff', userSelect: 'all' }}>
                   {payload.raw}
                 </div>
              </div>

              {payload.type === 'URL' && (
                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: payload.isDangerous ? 'rgba(255, 59, 59, 0.1)' : 'rgba(0, 255, 163, 0.1)', borderRadius: '8px', border: `1px solid ${payload.isDangerous ? 'var(--accent-red)' : 'var(--accent-green)'}` }}>
                   {payload.isDangerous ? (
                     <><AlertTriangle size={24} color="var(--accent-red)" /> <span style={{ color: 'var(--accent-red)', fontWeight: '500' }}>Malicious URL detected in payload. Do not visit.</span></>
                   ) : (
                     <><CheckCircle size={24} color="var(--accent-green)" /> <span style={{ color: 'var(--accent-green)', fontWeight: '500' }}>Destination appears benign based on static analysis.</span></>
                   )}
                </div>
              )}
            </div>
          ) : (
             <div className="glass-panel" style={{ height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
               <AlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
               Awaiting upload for payload extraction
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrDecoder;
