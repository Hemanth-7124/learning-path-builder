import type { Module, QuizAttempt, Certificate } from '~/types'
import { formatDuration } from '~/utils/formatting'

export const useCertificate = () => {
  // PDF generation state
  const isGeneratingPDF = ref(false)
  const pdfGenerationProgress = ref(0)

  // Generate certificate object from module and quiz result
  const generateCertificate = (module: Module, quizResult: QuizAttempt, learnerName: string): Certificate => {
    const certificateId = generateCertificateId()

    return {
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      moduleId: module.id,
      moduleName: module.title,
      learnerName,
      completionDate: new Date(),
      score: quizResult.score,
      certificateId
    }
  }

  // Generate unique certificate ID
  const generateCertificateId = (): string => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 9)
    return `CERT-${timestamp}-${random}`.toUpperCase()
  }

  // Simple and clean PDF certificate generation
  const generateCertificatePDF = async (certificate: Certificate, module: Module): Promise<string> => {
    if (typeof window === 'undefined') {
      throw new Error('PDF generation requires browser environment')
    }

    return new Promise((resolve, reject) => {
      try {
        // Dynamic import jsPDF to avoid SSR issues
        import('jspdf').then(({ jsPDF }) => {
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          })

          const pageWidth = doc.internal.pageSize.getWidth()
          const pageHeight = doc.internal.pageSize.getHeight()

          // Simple white background
          doc.setFillColor(255, 255, 255)
          doc.rect(0, 0, pageWidth, pageHeight, 'F')

          // Simple border
          const margin = 15
          doc.setDrawColor(100, 100, 100)
          doc.setLineWidth(1)
          doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)

          // Title
          doc.setFontSize(24)
          doc.setTextColor(50, 50, 50)
          doc.setFont('helvetica', 'bold')
          doc.text('Certificate of Completion', pageWidth / 2, 40, { align: 'center' })

          // Simple line under title
          doc.setDrawColor(100, 100, 100)
          doc.setLineWidth(1)
          doc.line(pageWidth / 2 - 40, 48, pageWidth / 2 + 40, 48)

          // Star icon
          doc.setFontSize(20)
          doc.setTextColor(255, 215, 0)
          doc.text('★', pageWidth / 2, 65, { align: 'center' })

          // Certification text
          doc.setFontSize(14)
          doc.setTextColor(80, 80, 80)
          doc.setFont('helvetica', 'normal')
          doc.text('This is to certify that', pageWidth / 2, 85, { align: 'center' })

          // Learner name (main highlight)
          doc.setFontSize(28)
          doc.setTextColor(70, 130, 180)
          doc.setFont('helvetica', 'bold')
          doc.text(certificate.learnerName, pageWidth / 2, 105, { align: 'center' })

          // Simple underline for name
          doc.setDrawColor(70, 130, 180, 0.5)
          doc.setLineWidth(1)
          doc.line(pageWidth / 2 - 50, 112, pageWidth / 2 + 50, 112)

          // Achievement text
          doc.setFontSize(12)
          doc.setTextColor(80, 80, 80)
          doc.setFont('helvetica', 'normal')
          doc.text('has successfully completed the module', pageWidth / 2, 130, { align: 'center' })

          // Module name
          doc.setFontSize(18)
          doc.setTextColor(50, 50, 50)
          doc.setFont('helvetica', 'bold')
          doc.text(module.title, pageWidth / 2, 145, { align: 'center' })

          // Simple module details (no complex boxes)
          doc.setFontSize(11)
          doc.setTextColor(100, 100, 100)
          doc.setFont('helvetica', 'normal')
          doc.text(`${module.category} • ${module.difficulty}`, pageWidth / 2, 160, { align: 'center' })
          doc.text(`Duration: ${formatDuration(module.duration)}`, pageWidth / 2, 170, { align: 'center' })

          // Score and Date section
          doc.setFontSize(14)
          doc.setTextColor(50, 50, 50)
          doc.setFont('helvetica', 'bold')
          doc.text(`Score: ${certificate.score}%`, pageWidth / 2 - 50, 190, { align: 'center' })

          const formattedDate = certificate.completionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
          doc.text(`Date: ${formattedDate}`, pageWidth / 2 + 50, 190, { align: 'center' })

          // Certificate ID
          doc.setFontSize(9)
          doc.setTextColor(120, 120, 120)
          doc.setFont('helvetica', 'italic')
          doc.text(`Certificate ID: ${certificate.certificateId}`, pageWidth / 2, 210, { align: 'center' })

          // Simple verification info
          doc.setFontSize(8)
          doc.setTextColor(140, 140, 140)
          doc.setFont('helvetica', 'normal')
          doc.text(`Verify: learning-path-builder.app/verify/${certificate.certificateId}`, pageWidth / 2, 220, { align: 'center' })

          // Simple signature section
          const signatureY = pageHeight - 45

          // Left signature line
          doc.setDrawColor(80, 80, 80)
          doc.setLineWidth(1)
          doc.line(pageWidth / 2 - 80, signatureY, pageWidth / 2 - 20, signatureY)

          doc.setFontSize(10)
          doc.setTextColor(50, 50, 50)
          doc.setFont('helvetica', 'normal')
          doc.text('Learning Path Builder', pageWidth / 2 - 50, signatureY + 10, { align: 'center' })

          doc.setFontSize(8)
          doc.setTextColor(120, 120, 120)
          doc.text('Platform', pageWidth / 2 - 50, signatureY + 16, { align: 'center' })

          // Right signature line
          doc.line(pageWidth / 2 + 20, signatureY, pageWidth / 2 + 80, signatureY)

          // Truncate long names for signature area
          const displayName = certificate.learnerName.length > 20 ?
            certificate.learnerName.substring(0, 17) + '...' : certificate.learnerName

          doc.setFontSize(10)
          doc.setTextColor(50, 50, 50)
          doc.text(displayName, pageWidth / 2 + 50, signatureY + 10, { align: 'center' })

          doc.setFontSize(8)
          doc.setTextColor(120, 120, 120)
          doc.text('Recipient', pageWidth / 2 + 50, signatureY + 16, { align: 'center' })

          // Simple seal (just a circle with checkmark)
          const sealX = pageWidth - 35
          const sealY = pageHeight - 35

          doc.setDrawColor(70, 130, 180)
          doc.setLineWidth(2)
          doc.circle(sealX, sealY, 12, 'S')

          doc.setFontSize(12)
          doc.setTextColor(34, 197, 94)
          doc.setFont('helvetica', 'bold')
          doc.text('✓', sealX, sealY + 4, { align: 'center' })

          // Simple footer
          doc.setFontSize(7)
          doc.setTextColor(150, 150, 150)
          doc.setFont('helvetica', 'normal')
          doc.text('Generated by Learning Path Builder', pageWidth / 2, pageHeight - 15, { align: 'center' })

          // Generate PDF
          const pdfBlob = doc.output('blob')
          const pdfUrl = URL.createObjectURL(pdfBlob)
          resolve(pdfUrl)

        }).catch((error) => {
          reject(new Error(`Failed to load jsPDF: ${error.message}`))
        })
      } catch (error) {
        reject(new Error(`PDF generation failed: ${error.message}`))
      }
    })
  }

  // Download certificate as PDF
  const downloadCertificate = async (certificate: Certificate, module: Module): Promise<void> => {
    if (isGeneratingPDF.value) {
      throw new Error('PDF generation already in progress')
    }

    isGeneratingPDF.value = true
    pdfGenerationProgress.value = 10

    try {
      // Update progress
      pdfGenerationProgress.value = 30

      // Generate Simple PDF with clean design
      const pdfUrl = await generateCertificatePDF(certificate, module)

      pdfGenerationProgress.value = 70

      // Create download link
      const link = document.createElement('a')
      link.href = pdfUrl
      const filename = `certificate-${module.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${certificate.learnerName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
      link.download = filename

      pdfGenerationProgress.value = 90

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up object URL
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl)
      }, 1000)

      pdfGenerationProgress.value = 100

      // Reset progress after a short delay
      setTimeout(() => {
        pdfGenerationProgress.value = 0
      }, 1000)

    } catch (error) {
      pdfGenerationProgress.value = 0
      throw error
    } finally {
      isGeneratingPDF.value = false
    }
  }

  // Validate certificate
  const validateCertificate = (certificateId: string): boolean => {
    // Basic validation - check if ID format is correct
    const certIdPattern = /^CERT-[A-Z0-9]+-[A-Z0-9]+$/
    return certIdPattern.test(certificateId)
  }

  
  // Helper function to add professional watermarks
  const addWatermark = (doc: any, text: string, x: number, y: number) => {
    doc.setFontSize(8)
    doc.setTextColor(99, 102, 241, 0.1)
    doc.setFont('helvetica', 'bold')
    doc.saveGraphicsState()
    doc.setGState(new doc.GState({ opacity: 0.1 }))
    doc.text(text, x, y, { angle: 45 })
    doc.restoreGraphicsState()
  }

  // Helper function to create decorative borders
  const createDecorativeBorders = (doc: any, pageWidth: number, pageHeight: number) => {
    const borderWidth = 25

    // Corner decorations
    const corners = [
      { x: borderWidth, y: borderWidth },
      { x: pageWidth - borderWidth, y: borderWidth },
      { x: borderWidth, y: pageHeight - borderWidth },
      { x: pageWidth - borderWidth, y: pageHeight - borderWidth }
    ]

    doc.setDrawColor(168, 85, 247, 0.3)
    doc.setLineWidth(1)

    corners.forEach((corner) => {
      // Create corner ornaments
      for (let i = 0; i < 5; i++) {
        const size = 2 + i
        doc.circle(corner.x, corner.y, size, 'S')
      }
    })

    // Side decorations
    doc.setDrawColor(99, 102, 241, 0.2)
    for (let i = 0; i < pageHeight; i += 20) {
      doc.setLineWidth(0.5)
      doc.line(10, i, 15, i)
      doc.line(pageWidth - 15, i, pageWidth - 10, i)
    }
  }

  // Enhanced PDF generation with advanced features
  const generateAdvancedCertificatePDF = async (certificate: Certificate, module: Module): Promise<string> => {
    return new Promise((resolve, reject) => {
      import('jspdf').then(({ jsPDF }) => {
        try {
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          })

          const pageWidth = doc.internal.pageSize.getWidth()
          const pageHeight = doc.internal.pageSize.getHeight()

          // Create professional background
          doc.setFillColor(255, 255, 255)
          doc.rect(0, 0, pageWidth, pageHeight, 'F')

          // Add subtle background pattern
          doc.setFillColor(99, 102, 241, 0.02)
          for (let x = 0; x < pageWidth; x += 10) {
            for (let y = 0; y < pageHeight; y += 10) {
              if ((x + y) % 20 === 0) {
                doc.circle(x, y, 1, 'F')
              }
            }
          }

          // Add decorative borders
          createDecorativeBorders(doc, pageWidth, pageHeight)

          // Main certificate border
          const mainBorder = 15
          doc.setDrawColor(99, 102, 241)
          doc.setLineWidth(2)
          doc.rect(mainBorder, mainBorder, pageWidth - mainBorder * 2, pageHeight - mainBorder * 2)

          // Inner border
          doc.setDrawColor(168, 85, 247, 0.5)
          doc.setLineWidth(1)
          doc.rect(mainBorder + 5, mainBorder + 5, pageWidth - (mainBorder + 5) * 2, pageHeight - (mainBorder + 5) * 2)

          // Certificate header with shadow effect
          doc.setFillColor(99, 102, 241, 0.05)
          doc.roundedRect(pageWidth / 2 - 100, 30, 200, 40, 5, 5, 'F')

          // Main title
          doc.setFontSize(28)
          doc.setTextColor(31, 41, 55)
          doc.setFont('helvetica', 'bold')
          doc.text('Certificate of Achievement', pageWidth / 2, 50, { align: 'center' })

          // Decorative element under title
          doc.setDrawColor(99, 102, 241)
          doc.setLineWidth(1.5)
          doc.line(pageWidth / 2 - 50, 60, pageWidth / 2 + 50, 60)

          // Star icon
          doc.setFontSize(24)
          doc.setTextColor(251, 191, 36)
          doc.text('★', pageWidth / 2, 78, { align: 'center' })

          // Certification text
          doc.setFontSize(14)
          doc.setTextColor(75, 85, 99)
          doc.setFont('helvetica', 'italic')
          doc.text('This is to certify that', pageWidth / 2, 100, { align: 'center' })

          // Recipient name with emphasis
          doc.setFillColor(99, 102, 241, 0.05)
          doc.roundedRect(pageWidth / 2 - 80, 110, 160, 30, 3, 3, 'F')

          doc.setFontSize(26)
          doc.setTextColor(99, 102, 241)
          doc.setFont('helvetica', 'bold')
          doc.text(certificate.learnerName, pageWidth / 2, 130, { align: 'center' })

          // Achievement text
          doc.setFontSize(13)
          doc.setTextColor(55, 65, 81)
          doc.setFont('helvetica', 'normal')
          doc.text('has successfully completed the course', pageWidth / 2, 155, { align: 'center' })

          // Module name with background
          doc.setFillColor(168, 85, 247, 0.05)
          doc.roundedRect(pageWidth / 2 - 90, 165, 180, 25, 3, 3, 'F')

          doc.setFontSize(18)
          doc.setTextColor(31, 41, 55)
          doc.setFont('helvetica', 'bold')
          doc.text(module.title, pageWidth / 2, 180, { align: 'center' })

          // Course details in card format
          const detailsCardY = 200
          const detailsCardWidth = 160
          const detailsCardHeight = 40
          const detailsCardX = pageWidth / 2 - detailsCardWidth / 2

          // Details card shadow
          doc.setFillColor(0, 0, 0, 0.05)
          doc.roundedRect(detailsCardX + 2, detailsCardY + 2, detailsCardWidth, detailsCardHeight, 5, 5, 'F')

          // Details card background
          doc.setFillColor(255, 255, 255)
          doc.roundedRect(detailsCardX, detailsCardY, detailsCardWidth, detailsCardHeight, 5, 5, 'F')

          // Details card border
          doc.setDrawColor(99, 102, 241, 0.3)
          doc.setLineWidth(1)
          doc.roundedRect(detailsCardX, detailsCardY, detailsCardWidth, detailsCardHeight, 5, 5, 'S')

          // Details text
          doc.setFontSize(11)
          doc.setTextColor(75, 85, 99)
          doc.text(`${module.category} • ${module.difficulty}`, pageWidth / 2, detailsCardY + 15, { align: 'center' })
          doc.text(`Duration: ${formatDuration(module.duration)}`, pageWidth / 2, detailsCardY + 28, { align: 'center' })

          // Achievement badges
          const badgesY = 260

          // Score badge
          const scoreBadgeX = pageWidth / 2 - 70
          doc.setFillColor(34, 197, 94, 0.1)
          doc.circle(scoreBadgeX, badgesY, 20, 'F')
          doc.setDrawColor(34, 197, 94, 0.5)
          doc.circle(scoreBadgeX, badgesY, 20, 'S')

          doc.setFontSize(16)
          doc.setTextColor(34, 197, 94)
          doc.setFont('helvetica', 'bold')
          doc.text(`${certificate.score}%`, scoreBadgeX, badgesY + 5, { align: 'center' })

          doc.setFontSize(9)
          doc.setTextColor(75, 85, 99)
          doc.setFont('helvetica', 'normal')
          doc.text('SCORE', scoreBadgeX, badgesY - 25, { align: 'center' })

          // Date badge
          const dateBadgeX = pageWidth / 2 + 70
          const formattedDate = certificate.completionDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })

          doc.setFillColor(99, 102, 241, 0.1)
          doc.circle(dateBadgeX, badgesY, 20, 'F')
          doc.setDrawColor(99, 102, 241, 0.5)
          doc.circle(dateBadgeX, badgesY, 20, 'S')

          doc.setFontSize(12)
          doc.setTextColor(99, 102, 241)
          doc.setFont('helvetica', 'bold')
          doc.text(formattedDate, dateBadgeX, badgesY + 3, { align: 'center' })

          doc.setFontSize(9)
          doc.setTextColor(75, 85, 99)
          doc.setFont('helvetica', 'normal')
          doc.text('COMPLETED', dateBadgeX - 25, badgesY - 25, { align: 'center' })

          // Certificate ID with background
          doc.setFillColor(107, 114, 128, 0.05)
          doc.roundedRect(pageWidth / 2 - 60, 290, 120, 15, 2, 2, 'F')

          doc.setFontSize(8)
          doc.setTextColor(107, 114, 128)
          doc.setFont('helvetica', 'italic')
          doc.text(`ID: ${certificate.certificateId}`, pageWidth / 2, 297, { align: 'center' })

          // Signature area
          const signatureY = pageHeight - 60

          // Left signature
          doc.setDrawColor(75, 85, 99)
          doc.setLineWidth(1)
          doc.line(pageWidth / 2 - 100, signatureY, pageWidth / 2 - 20, signatureY)

          doc.setFontSize(10)
          doc.setTextColor(31, 41, 55)
          doc.setFont('helvetica', 'bold')
          doc.text('Learning Path Builder', pageWidth / 2 - 60, signatureY + 8, { align: 'center' })

          doc.setFontSize(8)
          doc.setTextColor(107, 114, 128)
          doc.setFont('helvetica', 'normal')
          doc.text('Digital Learning Platform', pageWidth / 2 - 60, signatureY + 15, { align: 'center' })

          // Right signature
          doc.line(pageWidth / 2 + 20, signatureY, pageWidth / 2 + 100, signatureY)

          const displayName = certificate.learnerName.length > 18 ?
            certificate.learnerName.substring(0, 15) + '...' : certificate.learnerName

          doc.setFontSize(10)
          doc.setTextColor(31, 41, 55)
          doc.setFont('helvetica', 'bold')
          doc.text(displayName, pageWidth / 2 + 60, signatureY + 8, { align: 'center' })

          doc.setFontSize(8)
          doc.setTextColor(107, 114, 128)
          doc.setFont('helvetica', 'normal')
          doc.text('Achievement Recipient', pageWidth / 2 + 60, signatureY + 15, { align: 'center' })

          // Verification seal
          const sealX = pageWidth - 45
          const sealY = pageHeight - 45

          // Seal background
          doc.setFillColor(99, 102, 241, 0.1)
          doc.circle(sealX, sealY, 18, 'F')

          // Seal border
          doc.setDrawColor(99, 102, 241)
          doc.setLineWidth(2)
          doc.circle(sealX, sealY, 18, 'S')

          // Inner seal circle
          doc.setDrawColor(168, 85, 247)
          doc.setLineWidth(1)
          doc.circle(sealX, sealY, 14, 'S')

          // Checkmark
          doc.setFontSize(20)
          doc.setTextColor(34, 197, 94)
          doc.setFont('helvetica', 'bold')
          doc.text('✓', sealX, sealY + 7, { align: 'center' })

          // Verification text
          doc.setFontSize(6)
          doc.setTextColor(107, 114, 128)
          doc.setFont('helvetica', 'italic')
          doc.text('VERIFIED', sealX, sealY + 30, { align: 'center' })

          // Footer
          doc.setFontSize(7)
          doc.setTextColor(156, 163, 175)
          doc.setFont('helvetica', 'italic')
          doc.text('This certificate was digitally issued and can be verified online', pageWidth / 2, pageHeight - 20, { align: 'center' })

          // Security watermark
          addWatermark(doc, `CERT-${certificate.certificateId}`, pageWidth / 2, pageHeight / 2)

          // Generate PDF
          const pdfBlob = doc.output('blob')
          const pdfUrl = URL.createObjectURL(pdfBlob)
          resolve(pdfUrl)

        } catch (error) {
          reject(new Error(`Advanced PDF generation failed: ${error.message}`))
        }
      }).catch((error) => {
        reject(new Error(`Failed to load jsPDF: ${error.message}`))
      })
    })
  }

  // Print certificate
  const printCertificate = (certificateId: string): void => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate Verification</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: 'Georgia', serif;
                text-align: center;
              }
              .verification {
                max-width: 600px;
                margin: 50px auto;
                padding: 30px;
                border: 2px solid #ddd;
                border-radius: 10px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="verification">
              <h1>Certificate Verification</h1>
              <p>Certificate ID: <strong>${certificateId}</strong></p>
              <p>Status: <strong style="color: green;">✓ Valid</strong></p>
              <p>This certificate is authentic and was issued by Learning Path Builder.</p>
              <div class="no-print">
                <button onclick="window.print()">Print</button>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Share certificate
  const shareCertificate = async (certificate: Certificate, module: Module): Promise<void> => {
    const shareText = `I've successfully completed the ${module.title} module with a score of ${certificate.score}%! 🎉`
    const shareUrl = `learning-path-builder.app/verify/${certificate.certificateId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certificate of Completion',
          text: shareText,
          url: shareUrl
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
        // Fallback to clipboard
        await copyToClipboard(`${shareText}\nVerify: ${shareUrl}`)
      }
    } else {
      // Fallback to clipboard
      await copyToClipboard(`${shareText}\nVerify: ${shareUrl}`)
    }
  }

  // Helper function to copy to clipboard
  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      // TODO: Show success notification
      console.log('Text copied to clipboard')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  return {
    // State
    isGeneratingPDF: readonly(isGeneratingPDF),
    pdfGenerationProgress: readonly(pdfGenerationProgress),

    // Methods
    generateCertificate,
    generateCertificateId,
    generateCertificatePDF,
    generateAdvancedCertificatePDF,
    downloadCertificate,
    validateCertificate,
    printCertificate,
    shareCertificate,
    formatDuration
  }
}