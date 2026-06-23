// 📂 ફાઈલ પાથ: Types/Admission-request.ts

export interface AdmissionRequest {
  id: number;
  applicantName: string;
  applicantSuid: number;   // 👈 વિદ્યાર્થીનો SUID (નવો ઉમેર્યો)
  requestedRole: string;   // 'STUDENT' કે 'STAFF'
  departmentId: number;    // ડિપાર્ટમેન્ટ ID
  departmentName: string;  // ડિપાર્ટમેન્ટનું નામ
  sectionId?: number;      // વિદ્યાર્થી હોય તો સેક્શન ID (Optional)
  requestDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  additionalDetails?: string; // ડિસ્ક્રિપ્શન (Optional)
}

// ફોર્મ સબમિટ કરતી વખતે આ ટાઇપ વપરાશે
export interface CreateAdmissionInput {
  applicantName: string;
  applicantSuid: number;   // 👈 ફોર્મમાંથી બેકએન્ડમાં મોકલવા માટે
  requestedRole: string;
  departmentId: number;
  departmentName: string;
  sectionId?: number;
  additionalDetails?: string;
}

// API રિસ્પોન્સ માટેનો જેનરિક ટાઇપ
export interface AdmissionApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}