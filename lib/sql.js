const sql = {};
// Login v1 query
sql.login = {};
sql.login.v1 = {};
sql.login.v1.columns = ['user_id', 'user_label', 'office_id'];
sql.login.v1.query =    "SELECT "+ sql.login.v1.columns.join(',') +
                        " FROM user_setup" +
                        " WHERE op_number = ? AND user_password = ?";

// Login v2 query for Patient Login and getting details
sql.login = {};
sql.login.v2 = {};
sql.login.v2.columns = ['op_number', 'patient_name', 'sex','date_of_birth','mobile','emirates_id','registration_date'];
sql.login.v2.query =    "SELECT " + sql.login.v2.columns.join(',') + 
                            " FROM new_registration" +
                            " WHERE login_name = ? AND login_password = ? AND login_access = 'Y'";


// patient consult v1 query by op_number
sql.consult = {};
sql.consult.v1 = {};
sql.consult.v1.columns = ['DC.consult_id', 'DC.consult_date', 'DS.doctors_name', 'OD.office_Name', 'DC.office_id'];
sql.consult.v1.query =  "SELECT "+ sql.consult.v1.columns.join(',') +
                        " FROM doctor_consult DC" +
                        " LEFT JOIN doctors_setup DS ON DC.doctors_id = DS.doctors_id" +
                        " LEFT JOIN office_details OD ON DC.office_id = OD.office_Id" +
                        " WHERE DC.op_number = ?" +
                        " ORDER BY DC.consult_date DESC";

// patient diagnosis v1 query by op_number
sql.diagnosis = {};
sql.diagnosis.v1 = {};
sql.diagnosis.v1.columns = ['icd_desc', 'diagnosis_category', 'cd.type'];
sql.diagnosis.v1.query =  "SELECT "+ sql.diagnosis.v1.columns.join(',') +
                        " FROM consult_diagnosis cd" +
                        " JOIN icd_codes icd ON icd.icd_code = cd.diagnosis_id" +
                        " WHERE cd.consult_id = ?";

// patient complaint v1 query by op_number
sql.complaint = {};
sql.complaint.v1 = {};
sql.complaint.v1.columns = ['present_complaint'];
sql.complaint.v1.query =  "SELECT "+ sql.complaint.v1.columns.join(',') +
                        " FROM pain_rate" +
                        " WHERE consult_id = ?";

// patient vitalsigns v1 query by consult_id
sql.vitalsign = {};
sql.vitalsign.v1 = {};
sql.vitalsign.v1.columns = ['vital_signs.value', 'vitalsign_master.vital_sign', 'vitalsign_master.unit', 'vitalsign_range.min_value', 'vitalsign_range.max_value']
sql.vitalsign.v1.query =    "SELECT "+ sql.vitalsign.v1.columns.join(',') +
                            " FROM vital_signs" +
                            " JOIN vitalsign_master ON vital_signs.vital_sign = vitalsign_master.id" +
                            " JOIN vitalsign_range ON vitalsign_master.id = vitalsign_range.vitalsign_id" +
                            " WHERE consult_id = ?"

// patient labtests v1 query by consult_id
sql.labresult = {};
sql.labresult.v1 = {};
sql.labresult.v1.columns = ['a.test_id', 'a.test_name', 'c.parameter_id', 'c.parameter_name', 'd.id mappingid', 
                            'd.param_mapping_name' , 'test_result', 'fnormal_Value', 'f.measure']
sql.labresult.v1.query =     "SELECT "+ sql.labresult.v1.columns.join(',') +
                            " FROM test_setup a" + 
                            " JOIN test_parameter b ON a.test_id = b.test_id" +
                            " JOIN test_parameter_setup c ON b.parameter_id = c.parameter_id" +
                            " JOIN test_parameter_mapping d ON d.parameter_id = b.parameter_id" +
                            " JOIN test_Details e ON e.test_id = a.test_id" +
                            " JOIN test_results f ON f.test_detailsid = e.test_detailsid AND e.test_id= f.test_id AND f.parameter_id = c.parameter_id AND f.param_mapping_id = d.id" +
                            " WHERE e.consult_id= ? AND b.office_id= ? AND dispatch_status='Y'"

sql.medicine = {}
sql.medicine.v1 = {};
sql.medicine.v1.columns = [
    'consult_medicine.consult_id', 
    'consult_medicine.remarks', 
    'consult_medicine.medicine_dosage', 
    'medicine_setup.generic_name'];
sql.medicine.v1.query = "SELECT "+ sql.medicine.v1.columns.join(',') +
    " FROM consult_medicine" +
	" JOIN medicine_setup" +
	" ON medicine_setup.medicine_id = consult_medicine.medicine_id" +
    " WHERE consult_medicine.consult_id = ?";

// patient radiology result v1 query by consult_id
sql.radiology = {};
sql.radiology.v1 = {};
sql.radiology.v1.columns = ['test_setup.test_Name', 'test_details.remarks']
sql.radiology.v1.query =    "SELECT "+ sql.radiology.v1.columns.join(',') +
                            " FROM test_details" + 
                            " JOIN test_setup ON test_setup.test_Id = test_details.test_id" +
                            " WHERE lab_type <> 'L' AND consult_id = ?";

/*  doctors query
    v1: doctor list by office_id
    v2: All doctors (no filter on office_id)
    v3: Doctor profile by doctors_id
    v4: doctor's slot days and time for given date range 
*/
sql.doctors = {};
sql.doctors.v1 = {};
sql.doctors.v1.columns = ['ds.doctors_id', 'doctors_name', 'ds.doctor_type', 'department_name', 'od.office_Name']
sql.doctors.v1.query =  "SELECT " + sql.doctors.v1.columns.join(',') +
                        " FROM doctors_setup ds" +
                        " JOIN doctors_office docoff ON ds.doctors_id = docoff.doctors_id" +
                        " JOIN department_setup deps ON deps.department_id = docoff.department_id" +
                        " LEFT JOIN office_details od ON docoff.office_id = od.office_Id" +
                        " WHERE docoff.office_id = ?  AND ds.active_status = 'Y' ORDER BY doctors_name";
sql.doctors.v2 = {};
sql.doctors.v2.columns = ['ds.doctors_id', 'doctors_name', 'ds.doctor_type', 'department_name', 'od.office_Name', 'od.office_Id']
sql.doctors.v2.query =  "SELECT " + sql.doctors.v2.columns.join(',') +
                        " FROM doctors_setup ds" +
                        " JOIN doctors_office docoff ON ds.doctors_id = docoff.doctors_id" +
                        " JOIN department_setup deps ON deps.department_id = docoff.department_id" +
                        " LEFT JOIN office_details od ON docoff.office_id = od.office_Id" +
                        " WHERE ds.active_status  = 'Y' ORDER BY doctors_name";

sql.doctors.v3 = {};
sql.doctors.v3.columns = ['ds.doctors_id', 'doctors_name', 'ds.doctor_type']
sql.doctors.v3.query =  "SELECT " + sql.doctors.v3.columns.join(',') +
                        " FROM doctors_setup ds" +
                        " JOIN doctors_office docoff ON ds.doctors_id = docoff.doctors_id" +
                        " JOIN department_setup deps ON deps.department_id = docoff.department_id" +
                        " LEFT JOIN office_details od ON docoff.office_id = od.office_Id" +
                        " WHERE ds.active_status  = 'Y' AND ds.doctors_id = ? ORDER BY doctors_name";

sql.doctors.v4 = {};
sql.doctors.v4.columns = ['period_id','appoint_min','appoint_hr','slot_day']
sql.doctors.v4.query =  `SELECT DISTINCT  ${sql.doctors.v4.columns.join(',')},
                        CASE 
                            WHEN slot_day = 0  THEN "Saturday"
                            WHEN slot_day = 1 THEN "Sunday"
                            WHEN slot_day = 2 THEN "Monday"
                            WHEN slot_day = 3 THEN "Tuesday"
                            WHEN slot_day = 4 THEN "Wednesday"
                            WHEN slot_day = 5 THEN "Thursday"
                            ELSE "Friday"
                        END day
                        FROM appointment_sch WHERE period_id IN(
                        SELECT max(period_id) FROM appointment_sch  
                        WHERE doctors_id =  ? AND fromdate <=  ? AND todate >= ?
                        AND active_status = 'Y' group by  slot_day) ORDER BY slot_day ASC`

/*  insurar query
    v1: insurar activated user order by insurar name
*/
sql.insurar = {};
sql.insurar.v1 = {};
sql.insurar.v1.columns = ['insurar_id','insurar_name', 'office_id'];
sql.insurar.v1.query =  "SELECT " + sql.insurar.v1.columns.join(',') + 
                        " FROM insurance_provider " +
                        " WHERE active_status = 'Y' ORDER BY insurar_name";

sql.offices = {};
sql.offices.v1 = {};
sql.offices.v1.columns = ['office_Id', 'office_Name', 'address1','address2','phone_Numbers','fax_Numbers','website','email'];
sql.offices.v1.query =  "SELECT " + sql.offices.v1.columns.join(',') +
                        " FROM office_details" +
                        " WHERE active_Status = 'Y';"

sql.myprofile = {};
sql.myprofile.v1 = {};
sql.myprofile.v1.columns = ['NR.op_number', 'patient_name','sex','date_of_birth','mobile','emirates_id','registration_date', 'DC.consult_date', 'DC.insurar_name','DC.active_from','DC.valid_upto'];
sql.myprofile.v1.query =    "SELECT " + sql.myprofile.v1.columns.join(',') + 
                            " FROM new_registration NR  LEFT JOIN" +
                            " (SELECT IP.insurar_id,d_c.op_number, d_c.consult_date, IP.insurar_name,IP.active_from,IP.valid_upto "+
                            " FROM doctor_consult d_c LEFT JOIN insurance_provider IP " + 
                            " ON IP.insurar_id = d_c.insurar_id WHERE d_c.op_number = ? ORDER BY consult_date DESC LIMIT 1 ) DC" +
                            " ON DC.op_number = NR.op_number" +
                            " WHERE NR.op_number = ?";

module.exports = sql;