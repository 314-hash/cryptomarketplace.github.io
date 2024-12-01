import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  Paper,
  useTheme,
  Alert,
  LinearProgress,
  Tooltip,
  Zoom,
  Fade,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const ImageUpload = ({
  maxFiles = 5,
  maxSize = 5242880, // 5MB
  value = [],
  onChange,
  error,
}) => {
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (value.length + acceptedFiles.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Create a preview URL
        const preview = URL.createObjectURL(file);

        // Initialize progress for this file
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 0
        }));

        // Prepare form data for upload
        const formData = new FormData();
        formData.append('image', file);

        try {
          // Make API call to get presigned URL
          const response = await fetch('/api/upload/presign', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to get upload URL');
          }

          const { url, key } = await response.json();

          // Upload to S3 with progress tracking
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', url);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded * 100) / event.total);
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: progress
              }));
            }
          };

          await new Promise((resolve, reject) => {
            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve();
              } else {
                reject(new Error('Upload failed'));
              }
            };
            xhr.onerror = () => reject(new Error('Upload failed'));
            xhr.send(file);
          });

          // Return the image data
          return {
            url: `${process.env.REACT_APP_S3_BUCKET_URL}/${key}`,
            preview,
            name: file.name,
            size: file.size,
          };
        } catch (error) {
          throw error;
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedImages]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image(s). Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [value, onChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize,
    multiple: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleDelete = (index) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        {...getRootProps()}
        elevation={dragActive ? 4 : 1}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive
            ? 'primary.main'
            : error
            ? 'error.main'
            : theme.palette.divider,
          borderRadius: 2,
          bgcolor: isDragActive
            ? theme.palette.action.hover
            : error
            ? theme.palette.error.light
            : 'background.default',
          cursor: 'pointer',
          transition: theme.transitions.create(
            ['border-color', 'background-color', 'box-shadow'],
            { duration: 200 }
          ),
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <input {...getInputProps()} />
        <Fade in={true}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                bgcolor: isDragActive
                  ? theme.palette.primary.main
                  : 'transparent',
                transition: theme.transitions.create(['background-color']),
              }}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: isDragActive ? 'white' : 'text.secondary',
                  transition: theme.transitions.create(['color']),
                }}
              />
            </Box>
            <Typography
              variant="h6"
              color={isDragActive ? 'white' : 'text.primary'}
              align="center"
              sx={{ transition: theme.transitions.create(['color']) }}
            >
              {isDragActive
                ? 'Drop your images here'
                : 'Drag & drop your images here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              or click to browse
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
              Supported formats: JPEG, PNG, GIF, WebP
              <br />
              Max size: {formatFileSize(maxSize)} | Max files: {maxFiles}
            </Typography>
          </Box>
        </Fade>
      </Paper>

      {(uploadError || error) && (
        <Fade in={true}>
          <Alert
            severity="error"
            sx={{
              mt: 2,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                alignItems: 'center',
              },
            }}
          >
            {uploadError || error}
          </Alert>
        </Fade>
      )}

      {uploading && Object.keys(uploadProgress).length > 0 && (
        <Box sx={{ mt: 2 }}>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <Box key={fileName} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                  {fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {value.length > 0 && (
        <Fade in={true}>
          <ImageList
            sx={{
              width: '100%',
              mt: 2,
              gridTemplateColumns: 'repeat(auto-fill, minmax(164px, 1fr)) !important',
            }}
            gap={8}
          >
            {value.map((image, index) => (
              <ImageListItem
                key={index}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <img
                  src={image.preview || image.url}
                  alt={image.name}
                  loading="lazy"
                  style={{
                    height: 164,
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    opacity: 0,
                    transition: theme.transitions.create(['opacity']),
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}
                  >
                    <Tooltip title="Remove image" TransitionComponent={Zoom}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        display: 'block',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {image.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {formatFileSize(image.size)}
                    </Typography>
                  </Box>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        </Fade>
      )}
    </Box>
  );
};

export default ImageUpload;
