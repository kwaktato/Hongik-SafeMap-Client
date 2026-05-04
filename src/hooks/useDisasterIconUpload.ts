import { useGetDisasterIconUrl } from '@/api/presignedUrl';

export const useDisasterIconUpload = () => {
  const { mutateAsync: getPresignedUrl } = useGetDisasterIconUrl();

  // 파일 업로드
  const uploadToS3 = async (file: File) => {
    // 1) presigned url 요청
    const { presignedUrl, imageUrl } = await getPresignedUrl({
      fileName: file.name,
      contentType: file.type,
    });

    // 2) S3 PUT 업로드
    const uploadResult = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResult.ok) {
      throw new Error('S3 업로드에 실패했습니다.');
    }

    return imageUrl;
  };

  const uploadMultipleImages = async (files: File[]) => {
    if (files.length === 0) return [];
    return await Promise.all(files.map(uploadToS3));
  };

  return {
    uploadToS3,
    uploadMultipleImages,
  };
};
