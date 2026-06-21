export interface AdmissionRequest {
  id: number;              // રિક્વેસ્ટની પોતાની યુનિક પ્રાઇમરી કી (Auto Increment ID)
  applicantName: string;   // અરજી કરનારનું નામ
  requestedRole: string;   // 'STUDENT' કે 'STAFF' (જે તે ડિપાર્ટમેન્ટ હેડ દ્વારા મોકલેલ)
  departmentId: number;    // કયા ડિપાર્ટમેન્ટ માટે રિક્વેસ્ટ છે તેની ID
  departmentName: string;  
  sectionId?: number;      // જો વિદ્યાર્થી હોય તો સેક્શન ID (નહીંતર optional)
  requestDate: string;     // કઈ તારીખે રિક્વેસ્ટ આવી
  status: "PENDING" | "APPROVED" | "REJECTED";
  additionalDetails?: string;
}