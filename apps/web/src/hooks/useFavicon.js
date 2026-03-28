import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['image/x-icon', 'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif'];

export function useFavicon() {
  const [favicon, setFavicon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  const getAbsoluteFaviconUrl = (record) => {
    const backendUrl = pb.baseUrl.startsWith('http') ? pb.baseUrl : window.location.origin + pb.baseUrl;
    return `${backendUrl}/api/files/settings/${record.id}/${record.favicon}`;
  };

  // Fetch initial favicon from PocketBase
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const record = await pb.collection('settings').getFirstListItem('', { $autoCancel: false });
        setSettingsId(record.id);
        
        if (record.favicon) {
          setFavicon(getAbsoluteFaviconUrl(record));
        }
      } catch (error) {
        console.error('Failed to fetch settings from PocketBase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Update the DOM whenever the favicon state changes
  useEffect(() => {
    // Find and remove any existing favicon <link> tags
    const existingLinks = document.querySelectorAll("link[rel~='icon']");
    existingLinks.forEach(link => link.remove());

    if (favicon) {
      // Create a new <link> tag
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = favicon;
      
      // Try to set appropriate type based on file extension or data URI
      if (favicon.startsWith('data:')) {
        const match = favicon.match(/data:([^;]+);/);
        if (match && match[1]) {
          link.type = match[1];
        }
      } else if (favicon.endsWith('.svg')) {
        link.type = 'image/svg+xml';
      } else if (favicon.endsWith('.ico')) {
        link.type = 'image/x-icon';
      } else {
        link.type = 'image/x-icon'; // Default fallback
      }
      
      // Append the new link to document.head
      document.head.appendChild(link);
    }
  }, [favicon]);

  const uploadFavicon = async (file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload .ico, .png, .jpg, .gif, .svg, or .webp');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File is too large. Maximum size is 20MB.');
    }

    if (!settingsId) {
      throw new Error('Settings record not found in database. Please ensure the database is initialized.');
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('favicon', file);

      const updatedRecord = await pb.collection('settings').update(settingsId, formData, { $autoCancel: false });
      
      if (updatedRecord.favicon) {
        setFavicon(getAbsoluteFaviconUrl(updatedRecord));
      }
      
      return updatedRecord;
    } catch (error) {
      console.error('Failed to upload favicon:', error);
      throw new Error('Failed to save favicon to database.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavicon = async () => {
    if (!settingsId) return;
    
    setIsLoading(true);
    try {
      await pb.collection('settings').update(settingsId, { favicon: null }, { $autoCancel: false });
      setFavicon(null);
    } catch (error) {
      console.error('Failed to remove favicon:', error);
      throw new Error('Failed to remove favicon from database.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    favicon,
    uploadFavicon,
    removeFavicon,
    isLoading
  };
}