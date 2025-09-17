export type UnsignedUploadInput = {
	file: string | Blob;
	uploadPreset: string;
};

export type CloudinaryUploadResult = {
	asset_id?: string;
	public_id?: string;
	version?: number;
	signature?: string;
	width?: number;
	height?: number;
	format?: string;
	resource_type?: string;
	created_at?: string;
	bytes?: number;
	type?: string;
	etag?: string;
	placeholder?: boolean;
	url?: string;
	secure_url?: string;
	folder?: string;
	overwrite?: boolean;
	original_filename?: string;
};

/**
 * Perform an unsigned upload to Cloudinary. Client-safe.
 * Accepts either a full DataURL string or a File/Blob.
 */
export async function uploadToCloudinaryUnsigned(
	cloudName: string,
	input: UnsignedUploadInput
): Promise<CloudinaryUploadResult> {
	const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

	if (typeof input.file === "string") {
		const params = new URLSearchParams();
		params.append("file", input.file);
		params.append("upload_preset", input.uploadPreset);
		const res = await fetch(endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: params,
		});
		if (!res.ok) throw new Error((await res.json())?.error?.message || "Cloudinary upload failed");
		return res.json();
	}

	const form = new FormData();
	form.append("file", input.file);
	form.append("upload_preset", input.uploadPreset);
	const res = await fetch(endpoint, { method: "POST", body: form });
	if (!res.ok) throw new Error((await res.json())?.error?.message || "Cloudinary upload failed");
	return res.json();
}








