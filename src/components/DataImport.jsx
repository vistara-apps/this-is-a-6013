import React, { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Download, Trash2 } from 'lucide-react'
import Card from './ui/Card'

const DataImport = () => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [importHistory, setImportHistory] = useState([
    {
      id: 1,
      filename: 'customers_q4.csv',
      uploadDate: '2023-12-15',
      status: 'completed',
      recordsProcessed: 1247,
      recordsSucceeded: 1201,
      recordsFailed: 46,
      duplicatesFound: 23
    },
    {
      id: 2,
      filename: 'leads_november.csv',
      uploadDate: '2023-12-10',
      status: 'completed',
      recordsProcessed: 856,
      recordsSucceeded: 832,
      recordsFailed: 24,
      duplicatesFound: 15
    },
    {
      id: 3,
      filename: 'contacts_import.csv',
      uploadDate: '2023-12-08',
      status: 'processing',
      recordsProcessed: 45,
      recordsSucceeded: 40,
      recordsFailed: 5,
      duplicatesFound: 2
    }
  ])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files) => {
    const fileList = Array.from(files)
    const newFiles = fileList.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded'
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Data Import & Cleaning</h1>
          <p className="text-white/70">Upload and automatically clean your customer data</p>
        </div>
        <button className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
          Configure Sources
        </button>
      </div>

      {/* File Upload Area */}
      <Card title="Upload Customer Data">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop your CSV files here, or click to browse
          </h3>
          <p className="text-gray-500 mb-4">
            Supports CSV files up to 10MB. We'll automatically clean and standardize your data.
          </p>
          <input
            type="file"
            multiple
            accept=".csv"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer inline-block"
          >
            Choose Files
          </label>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-4">Uploaded Files</h4>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-green-600 font-medium">Ready to process</span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex space-x-3">
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Start Import & Cleaning
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Configure Mapping
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Data Cleaning Options */}
      <Card title="Cleaning & Standardization Rules">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Text Standardization</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Trim whitespace</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Standardize case (Title Case for names)</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Remove special characters from names</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Duplicate Detection</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Email exact match</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Phone number fuzzy match</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Name + company match</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Import History */}
      <Card title="Import History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">File</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Records</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Success Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Duplicates</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {importHistory.map((import_) => (
                <tr key={import_.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{import_.filename}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{import_.uploadDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {import_.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        import_.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {import_.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{import_.recordsProcessed}</td>
                  <td className="py-3 px-4">
                    <span className="text-gray-900 font-medium">
                      {Math.round((import_.recordsSucceeded / import_.recordsProcessed) * 100)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{import_.duplicatesFound}</td>
                  <td className="py-3 px-4">
                    <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default DataImport