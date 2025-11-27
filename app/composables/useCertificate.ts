import type { Module, QuizAttempt, Certificate } from '~/types'

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

  // Generate PDF certificate using jsPDF
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

          // Set dimensions
          const pageWidth = doc.internal.pageSize.getWidth()
          const pageHeight = doc.internal.pageSize.getHeight()

          // Add custom fonts if needed (for better typography)
          // Note: For production, you might want to add custom fonts
          doc.setFont('helvetica')

          // Background gradient effect (simulated with rectangles)
          doc.setFillColor(245, 247, 255) // Light blue background
          doc.rect(0, 0, pageWidth, pageHeight, 'F')

          // Decorative border
          const borderMargin = 15
          doc.setDrawColor(99, 102, 241) // Indigo color
          doc.setLineWidth(2)
          doc.rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2)

          // Inner border
          doc.setDrawColor(99, 102, 241, 0.5) // Lighter indigo
          doc.setLineWidth(1)
          doc.rect(borderMargin + 5, borderMargin + 5, pageWidth - (borderMargin + 5) * 2, pageHeight - (borderMargin + 5) * 2)

          // Title and Header
          doc.setFontSize(32)
          doc.setTextColor(31, 41, 55) // Dark gray
          doc.setFont('helvetica', 'bold')
          doc.text('Certificate of Completion', pageWidth / 2, 40, { align: 'center' })

          // Trophy icon placeholder (using text as replacement)
          doc.setFontSize(20)
          doc.setTextColor(251, 191, 36) // Gold color
          doc.text('🏆', pageWidth / 2, 60, { align: 'center' })

          // Divider line
          doc.setDrawColor(99, 102, 241)
          doc.setLineWidth(1)
          doc.line(pageWidth / 2 - 50, 70, pageWidth / 2 + 50, 70)

          // "This is to certify that"
          doc.setFontSize(14)
          doc.setTextColor(75, 85, 99) // Gray color
          doc.setFont('helvetica', 'normal')
          doc.text('This is to certify that', pageWidth / 2, 90, { align: 'center' })

          // Learner name (highlighted)
          doc.setFontSize(24)
          doc.setTextColor(99, 102, 241) // Indigo color
          doc.setFont('helvetica', 'bold')
          doc.text(certificate.learnerName, pageWidth / 2, 110, { align: 'center' })

          // Achievement text
          doc.setFontSize(14)
          doc.setTextColor(75, 85, 99) // Gray color
          doc.setFont('helvetica', 'normal')
          doc.text('has successfully completed the module', pageWidth / 2, 130, { align: 'center' })

          // Module name
          doc.setFontSize(18)
          doc.setTextColor(31, 41, 55) // Dark gray
          doc.setFont('helvetica', 'bold')
          doc.text(module.title, pageWidth / 2, 150, { align: 'center' })

          // Module details
          doc.setFontSize(12)
          doc.setTextColor(75, 85, 99) // Gray color
          doc.setFont('helvetica', 'normal')
          doc.text(`${module.category} • ${module.difficulty}`, pageWidth / 2, 165, { align: 'center' })

          // Module duration
          doc.text(`Duration: ${formatDuration(module.duration)}`, pageWidth / 2, 180, { align: 'center' })

          // Score
          doc.setFontSize(14)
          doc.setTextColor(34, 197, 94) // Green color
          doc.setFont('helvetica', 'bold')
          doc.text(`Score: ${certificate.score}%`, pageWidth / 2, 200, { align: 'center' })

          // Completion date
          doc.setFontSize(12)
          doc.setTextColor(75, 85, 99) // Gray color
          doc.setFont('helvetica', 'normal')
          const formattedDate = certificate.completionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
          doc.text(`Completed on: ${formattedDate}`, pageWidth / 2, 220, { align: 'center' })

          // Certificate ID
          doc.setFontSize(10)
          doc.setTextColor(107, 114, 128) // Lighter gray
          doc.setFont('helvetica', 'italic')
          doc.text(`Certificate ID: ${certificate.certificateId}`, pageWidth / 2, 235, { align: 'center' })

          // Verification URL
          doc.setFontSize(9)
          doc.setTextColor(107, 114, 128)
          doc.text(`Verify: learning-path-builder.app/verify/${certificate.certificateId}`, pageWidth / 2, 245, { align: 'center' })

          // Signature lines
          const signatureY = pageHeight - 50

          // Left signature (Platform)
          doc.setDrawColor(156, 163, 175) // Gray lines
          doc.line(pageWidth / 2 - 100, signatureY, pageWidth / 2 - 20, signatureY)
          doc.setFontSize(10)
          doc.setTextColor(75, 85, 99)
          doc.setFont('helvetica', 'normal')
          doc.text('Learning Path Builder', pageWidth / 2 - 60, signatureY + 10, { align: 'center' })
          doc.setFontSize(8)
          doc.text('Platform', pageWidth / 2 - 60, signatureY + 15, { align: 'center' })

          // Right signature (Learner)
          doc.line(pageWidth / 2 + 20, signatureY, pageWidth / 2 + 100, signatureY)
          doc.setFontSize(10)
          doc.text(certificate.learnerName, pageWidth / 2 + 60, signatureY + 10, { align: 'center' })
          doc.setFontSize(8)
          doc.text('Learner', pageWidth / 2 + 60, signatureY + 15, { align: 'center' })

          // Watermark/Seal
          doc.setFillColor(99, 102, 241, 0.1) // Very light indigo
          doc.circle(pageWidth - 30, 30, 20, 'F')
          doc.setTextColor(99, 102, 241)
          doc.setFontSize(12)
          doc.setFont('helvetica', 'bold')
          doc.text('✓', pageWidth - 30, 35, { align: 'center' })

          // Footer
          doc.setFontSize(8)
          doc.setTextColor(156, 163, 175)
          doc.setFont('helvetica', 'italic')
          doc.text('This certificate was generated by Learning Path Builder', pageWidth / 2, pageHeight - 10, { align: 'center' })

          // Generate filename
          const filename = `certificate-${module.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${certificate.learnerName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`

          // Generate PDF as blob
          const pdfBlob = doc.output('blob')

          // Create object URL
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

      // Generate PDF
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

  // Format duration helper
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins} minutes`
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
    downloadCertificate,
    validateCertificate,
    printCertificate,
    shareCertificate,
    formatDuration
  }
}