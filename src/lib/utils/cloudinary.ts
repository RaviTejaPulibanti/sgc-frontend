// src/lib/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename?: string;
  bytes: number;
  created_at: string;
  tags?: string[];
  context?: Record<string, any>;
}

export interface UploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: any;
  tags?: string[];
  context?: Record<string, string>;
  format?: string;
  quality?: string | number;
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  radius?: string | number;
  effect?: string;
  background?: string;
}

class CloudinaryService {
  private cloudinary = cloudinary;

  /**
   * Upload an image to Cloudinary
   */
  async uploadImage(
    file: string | Buffer,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions: any = {
        folder: options.folder || 'club-management',
        public_id: options.public_id,
        tags: options.tags,
        context: options.context,
        format: options.format,
      };

      // Add transformations if provided
      if (options.transformation) {
        uploadOptions.transformation = options.transformation;
      } else {
        // Default transformations
        const transformations: any[] = [];
        
        if (options.width || options.height) {
          transformations.push({
            width: options.width || 1200,
            height: options.height,
            crop: options.crop || 'limit',
            gravity: options.gravity,
          });
        }
        
        if (options.quality) {
          transformations.push({ quality: options.quality });
        } else {
          transformations.push({ quality: 'auto' });
        }
        
        if (options.radius) {
          transformations.push({ radius: options.radius });
        }
        
        if (options.effect) {
          transformations.push({ effect: options.effect });
        }
        
        if (options.background) {
          transformations.push({ background: options.background });
        }
        
        uploadOptions.transformation = transformations;
      }

      const result = await this.cloudinary.uploader.upload(file as string, uploadOptions);
      return result as CloudinaryUploadResult;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  async uploadMultipleImages(
    files: Array<string | Buffer>,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file, options));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload images');
    }
  }

  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Delete multiple images from Cloudinary
   */
  async deleteMultipleImages(publicIds: string[]): Promise<boolean> {
    try {
      const result = await this.cloudinary.api.delete_resources(publicIds);
      return Object.values(result.deleted).every((status) => status === 'deleted');
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      throw new Error('Failed to delete images');
    }
  }

  /**
   * Get image URL with transformations
   */
  getImageUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    format?: string;
    quality?: string | number;
    radius?: string | number;
    effect?: string;
    background?: string;
    angle?: number | string;
    border?: string;
    color?: string;
    overlay?: string;
    underlay?: string;
    x?: number;
    y?: number;
  } = {}): string {
    const {
      width,
      height,
      crop = 'fill',
      gravity = 'auto',
      format = 'auto',
      quality = 'auto',
      radius,
      effect,
      background,
      angle,
      border,
      color,
      overlay,
      underlay,
      x,
      y,
    } = options;

    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (gravity) transformations.push(`g_${gravity}`);
    if (radius) transformations.push(`r_${radius}`);
    if (effect) transformations.push(`e_${effect}`);
    if (background) transformations.push(`b_${background}`);
    if (angle) transformations.push(`a_${angle}`);
    if (border) transformations.push(`bo_${border}`);
    if (color) transformations.push(`co_${color}`);
    if (overlay) transformations.push(`l_${overlay}`);
    if (underlay) transformations.push(`u_${underlay}`);
    if (x) transformations.push(`x_${x}`);
    if (y) transformations.push(`y_${y}`);
    
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    const transformationString = transformations.join(',');
    
    return this.cloudinary.url(publicId, {
      transformation: transformationString,
      secure: true,
    });
  }

  /**
   * Get optimized image URL
   */
  getOptimizedImageUrl(publicId: string, width?: number): string {
    return this.getImageUrl(publicId, {
      width: width || 800,
      quality: 'auto',
      format: 'auto',
    });
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(publicId: string, options: {
    width?: number;
    height?: number;
    gravity?: string;
  } = {}): string {
    return this.getImageUrl(publicId, {
      width: options.width || 150,
      height: options.height || 150,
      crop: 'thumb',
      gravity: options.gravity || 'face',
    });
  }

  /**
   * Get avatar/profile image URL
   */
  getAvatarUrl(publicId: string, options: {
    size?: number;
    gravity?: string;
  } = {}): string {
    return this.getImageUrl(publicId, {
      width: options.size || 300,
      height: options.size || 300,
      crop: 'thumb',
      gravity: options.gravity || 'face',
      radius: 'max',
    });
  }

  /**
   * Get cover image URL
   */
  getCoverUrl(publicId: string, options: {
    width?: number;
    height?: number;
    gravity?: string;
  } = {}): string {
    return this.getImageUrl(publicId, {
      width: options.width || 1200,
      height: options.height || 400,
      crop: 'fill',
      gravity: options.gravity || 'auto',
    });
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  extractPublicIdFromUrl(url: string): string | null {
    try {
      // Match pattern: /v{version}/{public_id}.{format}
      const matches = url.match(/\/v\d+\/(.+)\./);
      if (matches && matches[1]) {
        return matches[1];
      }
      
      // Alternative pattern
      const altMatches = url.match(/\/upload\/(?:.+\/)?(.+?)(?:\.\w+)?$/);
      return altMatches ? altMatches[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Get image information
   */
  async getImageInfo(publicId: string): Promise<CloudinaryUploadResult> {
    try {
      const result = await this.cloudinary.api.resource(publicId);
      return result as CloudinaryUploadResult;
    } catch (error) {
      console.error('Error getting image info:', error);
      throw new Error('Failed to get image information');
    }
  }

  /**
   * Update image tags
   */
  async updateImageTags(publicId: string, tags: string[]): Promise<boolean> {
    try {
      await this.cloudinary.uploader.add_tag(tags.join(','), [publicId]);
      return true;
    } catch (error) {
      console.error('Error updating image tags:', error);
      throw new Error('Failed to update image tags');
    }
  }

  /**
   * Remove image tags
   */
  async removeImageTags(publicId: string, tags: string[]): Promise<boolean> {
    try {
      await this.cloudinary.uploader.remove_tag(tags.join(','), [publicId]);
      return true;
    } catch (error) {
      console.error('Error removing image tags:', error);
      throw new Error('Failed to remove image tags');
    }
  }

  /**
   * Rename image
   */
  async renameImage(oldPublicId: string, newPublicId: string): Promise<CloudinaryUploadResult> {
    try {
      const result = await this.cloudinary.uploader.rename(oldPublicId, newPublicId);
      return result as CloudinaryUploadResult;
    } catch (error) {
      console.error('Error renaming image:', error);
      throw new Error('Failed to rename image');
    }
  }

  /**
   * Generate a signed upload URL for client-side uploads
   */
  generateSignedUploadUrl(options: {
    folder?: string;
    public_id?: string;
    tags?: string[];
    context?: Record<string, string>;
    transformation?: string;
    uploadPreset?: string;
  } = {}): {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder?: string;
    public_id?: string;
    tags?: string;
    context?: string;
    transformation?: string;
    uploadPreset?: string;
  } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const params: Record<string, any> = {
      timestamp,
    };

    if (options.folder) params.folder = options.folder;
    if (options.public_id) params.public_id = options.public_id;
    if (options.tags) params.tags = options.tags.join(',');
    if (options.context) params.context = JSON.stringify(options.context);
    if (options.transformation) params.transformation = options.transformation;
    if (options.uploadPreset) params.upload_preset = options.uploadPreset;

    // Generate signature
    const signature = this.cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      folder: options.folder,
      public_id: options.public_id,
      tags: options.tags?.join(','),
      context: options.context ? JSON.stringify(options.context) : undefined,
      transformation: options.transformation,
      uploadPreset: options.uploadPreset,
    };
  }

  /**
   * Create a Cloudinary upload widget configuration
   */
  getUploadWidgetConfig(options: {
    folder?: string;
    tags?: string[];
    context?: Record<string, string>;
    maxFiles?: number;
    maxFileSize?: number;
    allowedFormats?: string[];
    sources?: string[];
    multiple?: boolean;
  } = {}) {
    return {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: options.folder || 'club-management',
      tags: options.tags,
      context: options.context,
      maxFiles: options.maxFiles || 10,
      maxFileSize: options.maxFileSize || 10485760, // 10MB
      allowedFormats: options.allowedFormats || ['jpg', 'png', 'gif', 'webp', 'jpeg'],
      sources: options.sources || ['local', 'url', 'camera'],
      multiple: options.multiple !== false,
    };
  }

  /**
   * Search for images
   */
  async searchImages(query: string, options: {
    maxResults?: number;
    nextCursor?: string;
    tags?: boolean;
    context?: boolean;
  } = {}): Promise<{
    resources: CloudinaryUploadResult[];
    nextCursor?: string;
    totalCount: number;
  }> {
    try {
      const searchExpression = this.cloudinary.search
        .expression(query)
        .max_results(options.maxResults || 50);
      
      if (options.tags) searchExpression.with_field('tags');
      if (options.context) searchExpression.with_field('context');
      if (options.nextCursor) searchExpression.next_cursor(options.nextCursor);
      
      const result = await searchExpression.execute();
      
      return {
        resources: result.resources as CloudinaryUploadResult[],
        nextCursor: result.next_cursor,
        totalCount: result.total_count,
      };
    } catch (error) {
      console.error('Error searching images:', error);
      throw new Error('Failed to search images');
    }
  }
}

export default new CloudinaryService();