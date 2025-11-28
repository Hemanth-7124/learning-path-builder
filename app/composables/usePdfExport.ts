import jsPDF from 'jspdf'
import type { LearningPath, Module } from '~/types'
import { formatDuration } from '~/utils/formatting'

export const usePdfExport = () => {
  const generatePdfFromData = async (learningPath: LearningPath): Promise<void> => {
    // Import the getOverallProgress function to use the proper calculation
    const { getOverallProgress } = useLearningPath()

    // Calculate progress statistics using the updated function
    const completedModules = learningPath.modules.filter(m => m.status === 'completed').length
    const totalModules = learningPath.modules.length
    const overallProgress = totalModules > 0 ? getOverallProgress() : 0
    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Define page dimensions and margins
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - 2 * margin
      let currentY = margin

      // Helper function to add text with automatic line wrapping
      const addText = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' = 'normal', x: number = margin) => {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', fontStyle)

        // Calculate line height
        const lineHeight = fontSize * 0.35

        // Split text into lines that fit within content width
        const lines = doc.splitTextToSize(text, contentWidth)

        // Add each line
        lines.forEach((line: string) => {
          // Check if we need a new page
          if (currentY + lineHeight > pageHeight - margin) {
            doc.addPage()
            currentY = margin
          }

          doc.text(line, x, currentY)
          currentY += lineHeight
        })

        return currentY
      }

      // Add document header
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Learning Path', pageWidth / 2, currentY, { align: 'center' })
      currentY += 10

      if (learningPath.name) {
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text(learningPath.name, pageWidth / 2, currentY, { align: 'center' })
        currentY += 8
      }

      currentY += 10

      // Add learning path summary
      const generatedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      const totalHours = Math.floor(learningPath.totalDuration / 60)
      const totalMinutes = learningPath.totalDuration % 60
      const durationText = totalHours > 0
        ? `${totalHours} hour${totalHours > 1 ? 's' : ''} ${totalMinutes > 0 ? `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}` : ''}`.trim()
        : `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}`

      const summaryText = `Generated on ${generatedDate} | ${learningPath.modules.length} module${learningPath.modules.length > 1 ? 's' : ''} | ${completedModules} completed | Overall Progress: ${overallProgress}% | Total Duration: ${durationText}`

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(summaryText, pageWidth / 2, currentY, { align: 'center' })
      currentY += 15

      // Add progress overview section (text only)
      if (totalModules > 0) {
        currentY += 5

        // Progress section header
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Progress Overview', margin, currentY)
        currentY += 7

        // Module status breakdown
        const notStartedCount = learningPath.modules.filter(m => (m.status || 'not-started') === 'not-started').length
        const inProgressCount = learningPath.modules.filter(m => m.status === 'in-progress').length

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Overall Progress: ${overallProgress}%`, margin, currentY)
        currentY += 5
        doc.text(`Not Started: ${notStartedCount} | In Progress: ${inProgressCount} | Completed: ${completedModules}`, margin, currentY)

        currentY += 15
      }

      // Add modules
      learningPath.modules.forEach((module, index) => {
        // Check if we need a new page for this module
        if (currentY > pageHeight - 60) {
          doc.addPage()
          currentY = margin
        }

        // Module number and title
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${module.title.toUpperCase()}`, margin, currentY)
        currentY += 7

        // Module metadata with status and progress
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const status = module.status || 'not-started'
        const progress = module.progress || 0
        const metadataText = `Category: ${module.category} | Difficulty: ${module.difficulty} | Duration: ${formatDuration(module.duration)} | Status: ${status.replace('-', ' ').toUpperCase()} | Progress: ${progress}%`
        doc.text(metadataText, margin, currentY)
        currentY += 5

        // Progress information included in text only (no visual progress bar)

        // Module description
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const descLines = doc.splitTextToSize(module.description, contentWidth)

        descLines.forEach((line: string) => {
          if (currentY > pageHeight - margin - 10) {
            doc.addPage()
            currentY = margin
          }
          doc.text(line, margin, currentY)
          currentY += 4
        })

        // Add spacing between modules (except for the last one)
        if (index < learningPath.modules.length - 1) {
          currentY += 8

          // Add separator line
          doc.setDrawColor(200, 200, 200)
          doc.setLineWidth(0.5)
          doc.line(margin, currentY, pageWidth - margin, currentY)
          currentY += 8
        }
      })

      // Add footer
      if (currentY > pageHeight - 30) {
        doc.addPage()
        currentY = margin
      }

      currentY += 10

      // Add footer line
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(1)
      doc.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 8

      // Footer text
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)

      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      doc.text('Generated by Learning Path Builder', pageWidth / 2, currentY, { align: 'center' })
      currentY += 5
      doc.text(currentDate, pageWidth / 2, currentY, { align: 'center' })

      // Reset text color
      doc.setTextColor(0, 0, 0)

      // Save the PDF
      const fileName = `${learningPath.name || 'learning-path'}-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

    } catch (error) {
      console.error('Error generating PDF:', error)
      throw new Error('Failed to generate PDF. Please try again.')
    }
  }

  
  return {
    generatePdfFromData
  }
}