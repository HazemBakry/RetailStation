using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Linq;


namespace MasterErp.Service.HR
{
    public class AttendanceService : IAttendanceService
    {
        private readonly DBContext Context;
        private readonly ISharedFilterService sharedFilterService;
        private readonly ISQLHelper SQLHelper;

        public AttendanceService(DBContext context, ISharedFilterService sharedFilterService, ISQLHelper sQLHelper)
        {
            Context = context;
            this.sharedFilterService = sharedFilterService;
            SQLHelper = sQLHelper;
        }
        public List<EmployeeAttendanceModel> GetAttendanceReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = SQLHelper.SQLQuery<EmployeeAttendanceModel>("[HR].[SP_GetEmployeeAttendance]", null, param);

            return result;
        }
        public List<EmployeeAdvancedAttendanceModel> GetAdvancedAttendanceReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);



            var result = SQLHelper.SQLQuery<EmployeeAttendanceModel>("[HR].[SP_GetAdvancedAttendanceReport_Data]", null, param);

            var grouped = result
               .GroupBy(x => x.EmployeeId)
               .Select(g =>
               {
                   var employee = g.First();
                   var attendanceList = g.Select(x => new AttendanceModel
                   {
                       AttendanceDate = x.AttendanceDate,
                       PunchDate = x.PunchDate,
                       PunchIn = x.PunchIn,
                       PunchOut = x.PunchOut,
                       Period1_PunchIn = x.Period1_PunchIn,
                       Period1_PunchOut = x.Period1_PunchOut,
                       Period2_PunchIn = x.Period2_PunchIn,
                       Period2_PunchOut = x.Period2_PunchOut,
                       TotalWorkSeconds = x.TotalWorkSeconds,
                       IsSickLeave = x.IsSickLeave,
                       IsVacation = x.IsVacation,
                   }).ToList();

                   return new EmployeeAdvancedAttendanceModel
                   {
                       EmployeeId = employee.EmployeeId,
                       EmployeeCode = employee.EmployeeCode,
                       EmployeeNameEN = employee.EmployeeNameEN,
                       EmployeeNameAR = employee.EmployeeNameAR,
                       BranchId = employee.BranchId,
                       BranchNameEN = employee.BranchNameEN,
                       BranchNameAR = employee.BranchNameAR,
                       Attendance = attendanceList,
                       TotalCount = employee.TotalCount,
                   };
               }).ToList();

            return grouped;
        } 
        
        public ActionsResponseModel ApproveEmployeesAttendance(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
           return new ActionsResponseModel {  IsSuccess = true , Message="Attendance Approved!"};
        }
        public List<EmployeeAttendanceModel> GetAttendance_Data(SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[0].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);
            
            param[1] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[2] = new SqlParameter("@PageSize", SearchModel.PageSize);

            var result = SQLHelper.SQLQuery<EmployeeAttendanceModel>("[HR].[SP_GetEmployeeAttendance]", null, param);
            return result;
        }
        public DataTable GetAttendance_Dataaaa()
        {
            //protected void btn_Search_Click(object sender, EventArgs e)
            //{
            //    List<EmployeeAttendance> EmployeeAttendanceList = new List<EmployeeAttendance>();
            //    // 6649 Aq - Fay
            //    // 8146 Az - Do
            //    int empid = 0;
            //    //8167
            //    try
            //    {
            //        BioTimeDataContext Context = new BioTimeDataContext();

            //        DateTime FromDate = dtp_FromDate.Date.Date;
            //        DateTime ToDate = dtp_ToDate.Date.Date.AddDays(1);

            //        DateTime First_TimeIn = DateTime.Now;
            //        DateTime First_TimeOut = DateTime.Now;
            //        DateTime Second_TimeIn = DateTime.Now;
            //        DateTime Second_TimeOut = DateTime.Now;

            //        string First_TotalTime = "";
            //        string Second_TotalTime = "";
            //        string TotalTime = "";

            //        AttendanceAllBranches_List.Clear();
            //        SalaryDeduction_List.Clear();

            //        cmb_BranchDeduction.SelectedIndex = cmb_Branch.SelectedIndex;
            //        dtp_YearDeduction.Text = dtp_Year.Text;
            //        cmb_MonthDeduction.SelectedIndex = cmb_Month.SelectedIndex;

            //        if (rb_AttendanceType.SelectedIndex == 1)
            //        {
            //            if (Int32.Parse(cmb_Month.Value.ToString()) == 1)
            //            {
            //                FromDate = DateTime.Parse((Int32.Parse(dtp_Year.Value.ToString()) - 1).ToString() + "-" + "12-21");
            //            }
            //            else
            //            {
            //                FromDate = DateTime.Parse(dtp_Year.Value.ToString() + "-" + (Int32.Parse(cmb_Month.Value.ToString()) - 1).ToString() + "-21");
            //            }

            //            ToDate = DateTime.Parse(dtp_Year.Value.ToString() + "-" + cmb_Month.Value.ToString() + "-21");

            //            dtp_FromDate.Date = FromDate.Date;
            //            dtp_ToDate.Date = ToDate.Date.Date.AddDays(-1);
            //        }

            //        int Code = 0;
            //        string BadgeNumber = "";

            //        if (chk_SearchInAllBranches.Checked && cmb_Employee.Value != null)
            //        {
            //            try
            //            {
            //                Code = Int32.Parse(cmb_Employee.Value.ToString());
            //                BadgeNumber = "";

            //                for (int j = 0; j < (9 - Code.ToString().Length); j++)
            //                {
            //                    BadgeNumber += "0";
            //                }

            //                BadgeNumber += Code.ToString();

            //                for (int i = 0; i < cmb_Branch.Items.Count; i++)
            //                {
            //                    try
            //                    {
            //                        Context.Connection.ConnectionString = "Data Source=10.1.1.2;Initial Catalog=" + ((List<Branches>)Session["BranchesAttendance_List"]).Single(x => x.BranchID == Int32.Parse(cmb_Branch.Items[i].Value.ToString())).BranchDataBase + ";User ID=sa;Password=zA0s5g?5!";

            //                        var AttendanceList = Context.checkinouts.Where(x => x.checktime > FromDate && x.checktime < ToDate.AddDays(1) && x.pin == BadgeNumber).ToList();

            //                        for (int j = 0; j < AttendanceList.Count; j++)
            //                        {
            //                            AttendanceAllBranches_List.Add(new AttendanceAllBranches { BadgeNumber = AttendanceList[j].pin, CheckTime = AttendanceList[j].checktime });
            //                        }
            //                    }
            //                    catch (Exception ex)
            //                    {

            //                    }
            //                }

            //                AttendanceAllBranches_List = AttendanceAllBranches_List.OrderBy(x => x.CheckTime).ToList();

            //                //if (Int32.Parse(cmb_Branch.SelectedItem.Value.ToString()) == 0 ||
            //                //    Int32.Parse(cmb_Branch.SelectedItem.Value.ToString()) == 1)
            //                //{
            //                //    Context.Connection.ConnectionString = "Data Source=10.1.1.2;Initial Catalog=BioTime;User ID=sa;Password=master";
            //                //}
            //                //else
            //                //{
            //                //    Context.Connection.ConnectionString = "Data Source=10.1." + Int32.Parse(cmb_Branch.SelectedItem.Value.ToString()) + ".20;Initial Catalog=BioTime;User ID=sa;Password=master2000";
            //                //}

            //                //var AttendanceList = Context.checkinouts.Where(x => x.checktime > FromDate && x.checktime < ToDate.AddDays(1)).ToList();

            //                //for (int j = 0; j < AttendanceList.Count; j++)
            //                //{
            //                //    AttendanceAllBranches_List.Add(new AttendanceAllBranches { BadgeNumber = AttendanceList[j].pin, CheckTime = AttendanceList[j].checktime });
            //                //}
            //            }
            //            catch (Exception ex)
            //            {

            //            }
            //        }
            //        else
            //        {
            //            try
            //            {
            //                Context.Connection.ConnectionString = "Data Source=10.1.1.2;Initial Catalog=" + ((List<Branches>)Session["BranchesAttendance_List"]).Single(x => x.BranchID == Int32.Parse(cmb_Branch.Value.ToString())).BranchDataBase + ";User ID=sa;Password=zA0s5g?5!";

            //                var AttendanceList = Context.checkinouts.Where(x => x.checktime > FromDate && x.checktime < ToDate.AddDays(1)).ToList();

            //                for (int j = 0; j < AttendanceList.Count; j++)
            //                {
            //                    AttendanceAllBranches_List.Add(new AttendanceAllBranches { BadgeNumber = AttendanceList[j].pin, CheckTime = AttendanceList[j].checktime });
            //                }
            //            }
            //            catch (Exception ex)
            //            {

            //            }
            //        }

            //        int BranchID = ((List<Branches>)Session["BranchesAttendance_List"]).Single(x => x.BranchID == Int32.Parse(cmb_Branch.Value.ToString())).BranchID;

            //        var EmployeeList = context.Employees.Where(x => x.StatusID == 1 && x.IsFinger).OrderBy(x => x.Code).ToList();

            //        if (cmb_Employee.Value != null)
            //        {
            //            Code = Int32.Parse(cmb_Employee.Value.ToString());
            //            EmployeeList = EmployeeList.Where(x => x.Code == Code).ToList();
            //        }
            //        else if (cmb_Branch.SelectedItem != null)
            //        {
            //            for (int i = 0; i < EmployeeList.Count; i++)
            //            {
            //                BadgeNumber = "";

            //                for (int j = 0; j < (9 - EmployeeList[i].Code.ToString().Length); j++)
            //                {
            //                    BadgeNumber += "0";
            //                }

            //                BadgeNumber += EmployeeList[i].Code.ToString();

            //                Code = EmployeeList[i].Code;

            //                if (context.Employees.Any(x => x.Code == Code))
            //                {
            //                    if (!AttendanceAllBranches_List.Any(x => x.BadgeNumber == BadgeNumber))
            //                    {
            //                        EmployeeList.RemoveAt(i);
            //                        i--;
            //                    }
            //                    else if (Int32.Parse(cmb_Branch.Value.ToString()) == 15)
            //                    {
            //                        if (context.Employees.Single(x => x.Code == Code).BranchID != 14 /* H - Accounting */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 15 /* H - Administration  */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 16 /* H - Catering */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 17 /* H - Cost control */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 18 /* H - Engineering & Projects */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 19 /* H - HR */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 20 /* H - Internal auditing */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 21 /* H - IT */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 22 /* H - Maintenance */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 23 /* H - Maintenance ( Abo Nasser ) */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 24 /* H - Operation */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 25 /* H - H - Purchasing */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 26 /* H - Quality */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 29 /* Abo Saad */ &&
            //                            context.Employees.Single(x => x.Code == Code).BranchID != 30 /* Abo Naser */)
            //                        {
            //                            EmployeeList = EmployeeList.Where(x => x.Code != Code).ToList();
            //                            i--;
            //                        }
            //                        else if (context.Employees.Single(x => x.Code == Code).StatusID != 1)
            //                        {
            //                            EmployeeList = EmployeeList.Where(x => x.Code != Code).ToList();
            //                            i--;
            //                        }
            //                    }
            //                    else
            //                    {
            //                        if (context.Employees.Single(x => x.Code == Code).BranchID != BranchID)
            //                        {
            //                            EmployeeList = EmployeeList.Where(x => x.Code != Code).ToList();
            //                            i--;
            //                        }
            //                        else if (context.Employees.Single(x => x.Code == Code).StatusID != 1)
            //                        {
            //                            EmployeeList = EmployeeList.Where(x => x.Code != Code).ToList();
            //                            i--;
            //                        }
            //                    }
            //                }
            //                else
            //                {
            //                    EmployeeList = EmployeeList.Where(x => x.Code != Code).ToList();
            //                    i--;
            //                }
            //            }
            //        }

            //        if (rb_AttendanceType.SelectedIndex == 0)
            //        {
            //            #region Attendance Daily

            //            dgv_Attendance.Visible = true;
            //            dgv_AttendanceMonthly.Visible = false;

            //            List<DateTime> FingerPrintList = new List<DateTime>();

            //            DateTime Get_1_DelayTime = new DateTime();
            //            DateTime Get_2_DelayTime = new DateTime();
            //            DateTime Get_3_DelayTime = new DateTime();
            //            DateTime Get_4_DelayTime = new DateTime();
            //            string Get_Total_DelayTime = "";

            //            string Get_Total_OverTime = "";

            //            DateTime FromDateShifts = FromDate.AddDays(-7).Date.Date;
            //            var LoadFingerPrintList = context.AttedanceDayOffs.Where(x => x.WeekStartDate >= FromDateShifts && x.WeekStartDate <= ToDate).OrderBy(x => x.WeekStartDate).ToList();

            //            for (DateTime CurrentDay = FromDate.Date; CurrentDay.Date < ToDate.Date; CurrentDay = CurrentDay.AddDays(1))
            //            {
            //                for (int i = 0; i < EmployeeList.Count; i++)
            //                {
            //                    FingerPrintList.Clear();
            //                    empid = EmployeeList[i].Code;
            //                    BadgeNumber = "";

            //                    for (int j = 0; j < (9 - EmployeeList[i].Code.ToString().Length); j++)
            //                    {
            //                        BadgeNumber += "0";
            //                    }

            //                    BadgeNumber += EmployeeList[i].Code.ToString();

            //                    var EmployeeAttendance = AttendanceAllBranches_List.Where(x => x.BadgeNumber == BadgeNumber && x.CheckTime.Date.Date == CurrentDay.Date.Date).OrderBy(x => x.CheckTime).ToList();

            //                    for (int j = 0; j < EmployeeAttendance.Count; j++)
            //                    {
            //                        if (EmployeeAttendance[j].CheckTime.ToShortTimeString().Split(' ')[1] == "AM")
            //                        {
            //                            if (EmployeeAttendance[j].CheckTime.Hour >= 5)
            //                            {
            //                                if (FingerPrintList.Count != 0)
            //                                {
            //                                    if (FingerPrintList[FingerPrintList.Count - 1].Hour != EmployeeAttendance[j].CheckTime.Hour ||
            //                                        FingerPrintList[FingerPrintList.Count - 1].Minute != EmployeeAttendance[j].CheckTime.Minute ||
            //                                        FingerPrintList[FingerPrintList.Count - 1].ToShortTimeString().Split(' ')[1] != EmployeeAttendance[j].CheckTime.ToShortTimeString().Split(' ')[1])
            //                                    {
            //                                        if (FingerPrintList.Count == 4)
            //                                        {
            //                                            FingerPrintList[FingerPrintList.Count - 1] = EmployeeAttendance[j].CheckTime;
            //                                        }
            //                                        else if (FingerPrintList[FingerPrintList.Count - 1].AddMinutes(10) < EmployeeAttendance[j].CheckTime)
            //                                        {
            //                                            FingerPrintList.Add(EmployeeAttendance[j].CheckTime);
            //                                        }
            //                                    }
            //                                }
            //                                else
            //                                {
            //                                    FingerPrintList.Add(EmployeeAttendance[j].CheckTime);
            //                                }
            //                            }
            //                        }
            //                        else
            //                        {
            //                            if (FingerPrintList.Count != 0)
            //                            {
            //                                if (FingerPrintList[FingerPrintList.Count - 1].Hour != EmployeeAttendance[j].CheckTime.Hour ||
            //                                    FingerPrintList[FingerPrintList.Count - 1].Minute != EmployeeAttendance[j].CheckTime.Minute ||
            //                                    FingerPrintList[FingerPrintList.Count - 1].ToShortTimeString().Split(' ')[1] != EmployeeAttendance[j].CheckTime.ToShortTimeString().Split(' ')[1])
            //                                {
            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        FingerPrintList[FingerPrintList.Count - 1] = EmployeeAttendance[j].CheckTime;
            //                                    }
            //                                    else if (FingerPrintList[FingerPrintList.Count - 1].AddMinutes(10) < EmployeeAttendance[j].CheckTime)
            //                                    {
            //                                        FingerPrintList.Add(EmployeeAttendance[j].CheckTime);
            //                                    }
            //                                }
            //                            }
            //                            else
            //                            {
            //                                FingerPrintList.Add(EmployeeAttendance[j].CheckTime);
            //                            }
            //                        }
            //                    }

            //                    if (EmployeeAttendance.Count != 0)
            //                    {
            //                        var EmployeeAttendanceNextDay = AttendanceAllBranches_List.Where(x => x.BadgeNumber == BadgeNumber && x.CheckTime.Date.Date == CurrentDay.AddDays(1)).OrderBy(x => x.CheckTime).ToList();

            //                        for (int j = 0; j < EmployeeAttendanceNextDay.Count; j++)
            //                        {
            //                            if (EmployeeAttendanceNextDay[j].CheckTime.ToShortTimeString().Split(' ')[1] == "AM")
            //                            {
            //                                if (EmployeeAttendanceNextDay[j].CheckTime.Hour <= 4)
            //                                {
            //                                    if (FingerPrintList.Count != 0)
            //                                    {
            //                                        if (FingerPrintList[FingerPrintList.Count - 1].Hour != EmployeeAttendanceNextDay[j].CheckTime.Hour ||
            //                                            FingerPrintList[FingerPrintList.Count - 1].Minute != EmployeeAttendanceNextDay[j].CheckTime.Minute ||
            //                                            FingerPrintList[FingerPrintList.Count - 1].ToShortTimeString().Split(' ')[1] != EmployeeAttendanceNextDay[j].CheckTime.ToShortTimeString().Split(' ')[1])
            //                                        {
            //                                            if (FingerPrintList.Count == 4)
            //                                            {
            //                                                FingerPrintList[FingerPrintList.Count - 1] = (EmployeeAttendanceNextDay[j].CheckTime);
            //                                            }
            //                                            else if (FingerPrintList[FingerPrintList.Count - 1].AddMinutes(10) < EmployeeAttendanceNextDay[j].CheckTime)
            //                                            {
            //                                                FingerPrintList.Add(EmployeeAttendanceNextDay[j].CheckTime);
            //                                            }
            //                                        }
            //                                    }
            //                                    else
            //                                    {
            //                                        FingerPrintList.Add(EmployeeAttendanceNextDay[j].CheckTime);
            //                                    }

            //                                }
            //                            }
            //                        }
            //                    }

            //                    // CalcuDelay Total

            //                    First_TotalTime = "--:--";
            //                    Second_TotalTime = "--:--";
            //                    TotalTime = "--:--";
            //                    Get_Total_DelayTime = "00:00";
            //                    Get_Total_OverTime = "00:00";

            //                    if (FingerPrintList.Count >= 2)
            //                    {
            //                        First_TotalTime = FingerPrintList[1].Subtract(FingerPrintList[0]).Hours.ToString() + ":" + FingerPrintList[1].Subtract(FingerPrintList[0]).Minutes.ToString();

            //                        TotalTime = First_TotalTime;
            //                    }
            //                    if (FingerPrintList.Count == 4)
            //                    {
            //                        Second_TotalTime = FingerPrintList[3].Subtract(FingerPrintList[2]).Hours.ToString() + ":" + FingerPrintList[3].Subtract(FingerPrintList[2]).Minutes.ToString();

            //                        TotalTime = (Int32.Parse(First_TotalTime.Split(':')[0]) + Int32.Parse(Second_TotalTime.Split(':')[0])).ToString() + ":" + (Int32.Parse(First_TotalTime.Split(':')[1]) + Int32.Parse(Second_TotalTime.Split(':')[1])).ToString();

            //                        if (Int32.Parse(TotalTime.Split(':')[1]) >= 60)
            //                        {
            //                            TotalTime = ((Int32.Parse(TotalTime.Split(':')[0]) + 1) + ":" + (Int32.Parse(TotalTime.Split(':')[1]) - 60)).ToString();
            //                        }
            //                    }

            //                    if (TotalTime != "--:--")
            //                    {
            //                        if (TotalTime.Split(':')[0].Length == 1)
            //                        {
            //                            TotalTime = "0" + TotalTime.Split(':')[0] + ":" + TotalTime.Split(':')[1];
            //                        }
            //                        if (TotalTime.Split(':')[1].Length == 1)
            //                        {
            //                            TotalTime = TotalTime.Split(':')[0] + ":" + "0" + TotalTime.Split(':')[1];
            //                        }
            //                    }

            //                    int DaysUntilSaturday = ((int)DayOfWeek.Saturday - (int)CurrentDay.Date.DayOfWeek - 7) % 7;
            //                    DateTime CurrentSaturday = CurrentDay.Date.AddDays(DaysUntilSaturday).Date.Date;

            //                    if (LoadFingerPrintList.Any(x => x.EmployeeID == EmployeeList[i].EmployeeID && x.WeekStartDate == CurrentSaturday))
            //                    {
            //                        var LoadWeekFingerPrintList = LoadFingerPrintList.Single(x => x.EmployeeID == EmployeeList[i].EmployeeID && x.WeekStartDate == CurrentSaturday);

            //                        if (LoadWeekFingerPrintList.WeekStartDate == CurrentDay) // Saturday
            //                        {
            //                            #region Saturday

            //                            switch (Get_Shift_Type(LoadWeekFingerPrintList.Saturday_Shift_1, LoadWeekFingerPrintList.Saturday_Shift_2, LoadWeekFingerPrintList.Saturday_Shift_3, LoadWeekFingerPrintList.Saturday_Shift_4))
            //                            {
            //                                case 1:

            //                                    if (FingerPrintList.Count >= 2)
            //                                    {
            //                                        if (LoadWeekFingerPrintList.Saturday_Shift_1 != "" && LoadWeekFingerPrintList.Saturday_Shift_2 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Saturday_Shift_1);
            //                                            Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Saturday_Shift_2);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                        else if (LoadWeekFingerPrintList.Saturday_Shift_1 != "" && LoadWeekFingerPrintList.Saturday_Shift_4 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Saturday_Shift_1);
            //                                            Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Saturday_Shift_4);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                    }

            //                                    break;

            //                                case 2:

            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Saturday_Shift_1);
            //                                        Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Saturday_Shift_2);
            //                                        Get_3_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Saturday_Shift_3);
            //                                        Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Saturday_Shift_4);

            //                                        Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) +
            //                                                               (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0) +
            //                                                               (FingerPrintList[2].Subtract(Get_3_DelayTime).Hours > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Hours : 0) +
            //                                                               (Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) +
            //                                                                (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0) +
            //                                                                (FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes : 0) +
            //                                                                (Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes : 0)).ToString();

            //                                        Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) +
            //                                                               (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0) +
            //                                                               (Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours : 0) +
            //                                                               (FingerPrintList[3].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) +
            //                                                                (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0) +
            //                                                                (Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes : 0) +
            //                                                                (FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();

            //                                    }

            //                                    break;
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(1) == CurrentDay) // Sunday
            //                        {
            //                            #region Sunday

            //                            switch (Get_Shift_Type(LoadWeekFingerPrintList.Sunday_Shift_1, LoadWeekFingerPrintList.Sunday_Shift_2, LoadWeekFingerPrintList.Sunday_Shift_3, LoadWeekFingerPrintList.Sunday_Shift_4))
            //                            {
            //                                case 1:

            //                                    if (FingerPrintList.Count >= 2)
            //                                    {
            //                                        if (LoadWeekFingerPrintList.Sunday_Shift_1 != "" && LoadWeekFingerPrintList.Sunday_Shift_2 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Sunday_Shift_1);
            //                                            Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Sunday_Shift_2);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                        else if (LoadWeekFingerPrintList.Sunday_Shift_1 != "" && LoadWeekFingerPrintList.Sunday_Shift_4 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Sunday_Shift_1);
            //                                            Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Sunday_Shift_4);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                    }

            //                                    break;

            //                                case 2:

            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Sunday_Shift_1);
            //                                        Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Sunday_Shift_2);
            //                                        Get_3_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Sunday_Shift_3);
            //                                        Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Sunday_Shift_4);

            //                                        Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) +
            //                                                               (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0) +
            //                                                               (FingerPrintList[2].Subtract(Get_3_DelayTime).Hours > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Hours : 0) +
            //                                                               (Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) +
            //                                                                (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0) +
            //                                                                (FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes : 0) +
            //                                                                (Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes : 0)).ToString();

            //                                        Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) +
            //                                                               (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0) +
            //                                                               (Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours : 0) +
            //                                                               (FingerPrintList[3].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) +
            //                                                                (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0) +
            //                                                                (Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes : 0) +
            //                                                                (FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();

            //                                    }

            //                                    break;
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(2) == CurrentDay) // Monday
            //                        {
            //                            #region Monday

            //                            switch (Get_Shift_Type(LoadWeekFingerPrintList.Monday_Shift_1, LoadWeekFingerPrintList.Monday_Shift_2, LoadWeekFingerPrintList.Monday_Shift_3, LoadWeekFingerPrintList.Monday_Shift_4))
            //                            {
            //                                case 1:

            //                                    if (FingerPrintList.Count >= 2)
            //                                    {
            //                                        if (LoadWeekFingerPrintList.Monday_Shift_1 != "" && LoadWeekFingerPrintList.Monday_Shift_2 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Monday_Shift_1);
            //                                            Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Monday_Shift_2);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                        else if (LoadWeekFingerPrintList.Monday_Shift_1 != "" && LoadWeekFingerPrintList.Monday_Shift_4 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Monday_Shift_1);
            //                                            Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Monday_Shift_4);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                    }

            //                                    break;

            //                                case 2:

            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Monday_Shift_1);
            //                                        Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Monday_Shift_2);
            //                                        Get_3_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Monday_Shift_3);
            //                                        Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Monday_Shift_4);

            //                                        Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) +
            //                                                               (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0) +
            //                                                               (FingerPrintList[2].Subtract(Get_3_DelayTime).Hours > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Hours : 0) +
            //                                                               (Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) +
            //                                                                (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0) +
            //                                                                (FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes : 0) +
            //                                                                (Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes : 0)).ToString();

            //                                        Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) +
            //                                                               (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0) +
            //                                                               (Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours : 0) +
            //                                                               (FingerPrintList[3].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) +
            //                                                                (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0) +
            //                                                                (Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes : 0) +
            //                                                                (FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();

            //                                    }

            //                                    break;
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(3) == CurrentDay) // Tuesday
            //                        {
            //                            #region Tuesday

            //                            switch (Get_Shift_Type(LoadWeekFingerPrintList.Tuesday_Shift_1, LoadWeekFingerPrintList.Tuesday_Shift_2, LoadWeekFingerPrintList.Tuesday_Shift_3, LoadWeekFingerPrintList.Tuesday_Shift_4))
            //                            {
            //                                case 1:

            //                                    if (FingerPrintList.Count >= 2)
            //                                    {
            //                                        if (LoadWeekFingerPrintList.Tuesday_Shift_1 != "" && LoadWeekFingerPrintList.Tuesday_Shift_2 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Tuesday_Shift_1);
            //                                            Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Tuesday_Shift_2);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                        else if (LoadWeekFingerPrintList.Tuesday_Shift_1 != "" && LoadWeekFingerPrintList.Tuesday_Shift_4 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Tuesday_Shift_1);
            //                                            Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Tuesday_Shift_4);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                    }

            //                                    break;

            //                                case 2:

            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Tuesday_Shift_1);
            //                                        Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Tuesday_Shift_2);
            //                                        Get_3_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Tuesday_Shift_3);
            //                                        Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Tuesday_Shift_4);

            //                                        Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) +
            //                                                               (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0) +
            //                                                               (FingerPrintList[2].Subtract(Get_3_DelayTime).Hours > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Hours : 0) +
            //                                                               (Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) +
            //                                                                (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0) +
            //                                                                (FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes : 0) +
            //                                                                (Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes : 0)).ToString();

            //                                        Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) +
            //                                                               (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0) +
            //                                                               (Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours : 0) +
            //                                                               (FingerPrintList[3].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) +
            //                                                                (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0) +
            //                                                                (Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes : 0) +
            //                                                                (FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();

            //                                    }

            //                                    break;
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(4) == CurrentDay) // Wednesday
            //                        {
            //                            #region Wednesday

            //                            switch (Get_Shift_Type(LoadWeekFingerPrintList.Wednesday_Shift_1, LoadWeekFingerPrintList.Wednesday_Shift_2, LoadWeekFingerPrintList.Wednesday_Shift_3, LoadWeekFingerPrintList.Wednesday_Shift_4))
            //                            {
            //                                case 1:

            //                                    if (FingerPrintList.Count >= 2)
            //                                    {
            //                                        if (LoadWeekFingerPrintList.Wednesday_Shift_1 != "" && LoadWeekFingerPrintList.Wednesday_Shift_2 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Wednesday_Shift_1);
            //                                            Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Wednesday_Shift_2);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                        else if (LoadWeekFingerPrintList.Wednesday_Shift_1 != "" && LoadWeekFingerPrintList.Wednesday_Shift_4 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Wednesday_Shift_1);
            //                                            Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Wednesday_Shift_4);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                    }

            //                                    break;

            //                                case 2:

            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Wednesday_Shift_1);
            //                                        Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Wednesday_Shift_2);
            //                                        Get_3_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Wednesday_Shift_3);
            //                                        Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Wednesday_Shift_4);

            //                                        Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) +
            //                                                               (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0) +
            //                                                               (FingerPrintList[2].Subtract(Get_3_DelayTime).Hours > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Hours : 0) +
            //                                                               (Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) +
            //                                                                (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0) +
            //                                                                (FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes : 0) +
            //                                                                (Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes : 0)).ToString();

            //                                        Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) +
            //                                                               (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0) +
            //                                                               (Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours : 0) +
            //                                                               (FingerPrintList[3].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) +
            //                                                                (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0) +
            //                                                                (Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes : 0) +
            //                                                                (FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();

            //                                    }

            //                                    break;
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(5) == CurrentDay) // Thursday
            //                        {
            //                            #region Thursday

            //                            switch (Get_Shift_Type(LoadWeekFingerPrintList.Thursday_Shift_1, LoadWeekFingerPrintList.Thursday_Shift_2, LoadWeekFingerPrintList.Thursday_Shift_3, LoadWeekFingerPrintList.Thursday_Shift_4))
            //                            {
            //                                case 1:

            //                                    if (FingerPrintList.Count >= 2)
            //                                    {
            //                                        if (LoadWeekFingerPrintList.Thursday_Shift_1 != "" && LoadWeekFingerPrintList.Thursday_Shift_2 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Thursday_Shift_1);
            //                                            Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Thursday_Shift_2);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                        else if (LoadWeekFingerPrintList.Thursday_Shift_1 != "" && LoadWeekFingerPrintList.Thursday_Shift_4 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Thursday_Shift_1);
            //                                            Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Thursday_Shift_4);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                    }

            //                                    break;

            //                                case 2:

            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Thursday_Shift_1);
            //                                        Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Thursday_Shift_2);
            //                                        Get_3_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Thursday_Shift_3);
            //                                        Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Thursday_Shift_4);

            //                                        Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) +
            //                                                               (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0) +
            //                                                               (FingerPrintList[2].Subtract(Get_3_DelayTime).Hours > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Hours : 0) +
            //                                                               (Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) +
            //                                                                (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0) +
            //                                                                (FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes : 0) +
            //                                                                (Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes : 0)).ToString();

            //                                        Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) +
            //                                                               (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0) +
            //                                                               (Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours : 0) +
            //                                                               (FingerPrintList[3].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) +
            //                                                                (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0) +
            //                                                                (Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes : 0) +
            //                                                                (FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();

            //                                    }

            //                                    break;
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(6) == CurrentDay) // Friday
            //                        {
            //                            #region Friday

            //                            switch (Get_Shift_Type(LoadWeekFingerPrintList.Friday_Shift_1, LoadWeekFingerPrintList.Friday_Shift_2, LoadWeekFingerPrintList.Friday_Shift_3, LoadWeekFingerPrintList.Friday_Shift_4))
            //                            {
            //                                case 1:

            //                                    if (FingerPrintList.Count >= 2)
            //                                    {
            //                                        if (LoadWeekFingerPrintList.Friday_Shift_1 != "" && LoadWeekFingerPrintList.Friday_Shift_2 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Friday_Shift_1);
            //                                            Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Friday_Shift_2);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                        else if (LoadWeekFingerPrintList.Friday_Shift_1 != "" && LoadWeekFingerPrintList.Friday_Shift_4 != "")
            //                                        {
            //                                            Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Friday_Shift_1);
            //                                            Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Friday_Shift_4);

            //                                            Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Hours : 0)).ToString() + ":" +
            //                                                                  ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) + (Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0)).ToString();

            //                                            Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Hours : 0)).ToString() + ":" +
            //                                                                  ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) + (FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();
            //                                        }
            //                                    }

            //                                    break;

            //                                case 2:

            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        Get_1_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Friday_Shift_1);
            //                                        Get_2_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Friday_Shift_2);
            //                                        Get_3_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Friday_Shift_3);
            //                                        Get_4_DelayTime = Get_AttendanceTimes(CurrentDay, LoadWeekFingerPrintList.Friday_Shift_4);

            //                                        Get_Total_DelayTime = ((FingerPrintList[0].Subtract(Get_1_DelayTime).Hours > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Hours : 0) +
            //                                                               (Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Hours : 0) +
            //                                                               (FingerPrintList[2].Subtract(Get_3_DelayTime).Hours > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Hours : 0) +
            //                                                               (Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes > 0 ? FingerPrintList[0].Subtract(Get_1_DelayTime).Minutes : 0) +
            //                                                                (Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes > 0 ? Get_2_DelayTime.Subtract(FingerPrintList[1]).Minutes : 0) +
            //                                                                (FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes > 0 ? FingerPrintList[2].Subtract(Get_3_DelayTime).Minutes : 0) +
            //                                                                (Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes > 0 ? Get_4_DelayTime.Subtract(FingerPrintList[3]).Minutes : 0)).ToString();

            //                                        Get_Total_OverTime = ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Hours : 0) +
            //                                                               (FingerPrintList[1].Subtract(Get_2_DelayTime).Hours > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Hours : 0) +
            //                                                               (Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Hours : 0) +
            //                                                               (FingerPrintList[3].Subtract(Get_4_DelayTime).Hours > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Hours : 0)).ToString() +
            //                                                               ":" +
            //                                                               ((Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes > 0 ? Get_1_DelayTime.Subtract(FingerPrintList[0]).Minutes : 0) +
            //                                                                (FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes > 0 ? FingerPrintList[1].Subtract(Get_2_DelayTime).Minutes : 0) +
            //                                                                (Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes > 0 ? Get_3_DelayTime.Subtract(FingerPrintList[2]).Minutes : 0) +
            //                                                                (FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes > 0 ? FingerPrintList[3].Subtract(Get_4_DelayTime).Minutes : 0)).ToString();

            //                                    }

            //                                    break;
            //                            }

            //                            #endregion
            //                        }
            //                    }

            //                    if (Get_Total_DelayTime != "00:00")
            //                    {
            //                        if (Int32.Parse(Get_Total_DelayTime.Split(':')[1]) >= 60)
            //                        {
            //                            Get_Total_DelayTime = ((Int32.Parse(Get_Total_DelayTime.Split(':')[0]) + 1) + ":" + (Int32.Parse(Get_Total_DelayTime.Split(':')[1]) - 60)).ToString();
            //                        }

            //                        if (Get_Total_DelayTime.Split(':')[0].Length == 1)
            //                        {
            //                            Get_Total_DelayTime = "0" + Get_Total_DelayTime.Split(':')[0] + ":" + Get_Total_DelayTime.Split(':')[1];
            //                        }
            //                        if (Get_Total_DelayTime.Split(':')[1].Length == 1)
            //                        {
            //                            Get_Total_DelayTime = Get_Total_DelayTime.Split(':')[0] + ":" + "0" + Get_Total_DelayTime.Split(':')[1];
            //                        }
            //                    }

            //                    if (Get_Total_OverTime != "00:00")
            //                    {
            //                        if (Int32.Parse(Get_Total_OverTime.Split(':')[1]) >= 60)
            //                        {
            //                            Get_Total_OverTime = ((Int32.Parse(Get_Total_OverTime.Split(':')[0]) + 1) + ":" + (Int32.Parse(Get_Total_OverTime.Split(':')[1]) - 60)).ToString();
            //                        }

            //                        if (Get_Total_OverTime.Split(':')[0].Length == 1)
            //                        {
            //                            Get_Total_OverTime = "0" + Get_Total_OverTime.Split(':')[0] + ":" + Get_Total_OverTime.Split(':')[1];
            //                        }
            //                        if (Get_Total_OverTime.Split(':')[1].Length == 1)
            //                        {
            //                            Get_Total_OverTime = Get_Total_OverTime.Split(':')[0] + ":" + "0" + Get_Total_OverTime.Split(':')[1];
            //                        }
            //                    }

            //                    EmployeeAttendanceList.Add(new EmployeeAttendance
            //                    {
            //                        SN = EmployeeAttendanceList.Count + 1,
            //                        AttendanceDate = CurrentDay.Date,
            //                        AttendanceDay = CurrentDay.Date.DayOfWeek.ToString(),
            //                        EmployeeCode = EmployeeList[i].Code.ToString(),
            //                        EmployeeName = EmployeeList[i].FirstNameEN + " " + EmployeeList[i].FatherNameEN,
            //                        First_TimeIn = FingerPrintList.Count >= 1 ? FingerPrintList[0].ToString("hh:mm tt") : "--:--",
            //                        First_TimeOut = FingerPrintList.Count >= 2 ? FingerPrintList[1].ToString("hh:mm tt") : "--:--",
            //                        Second_TimeIn = FingerPrintList.Count >= 3 ? FingerPrintList[2].ToString("hh:mm tt") : "--:--",
            //                        Second_TimeOut = FingerPrintList.Count >= 4 ? FingerPrintList[3].ToString("hh:mm tt") : "--:--",
            //                        Total_Time = TotalTime,
            //                        Delay_Time = Get_Total_DelayTime != "00:00" ? Get_Total_DelayTime : "--:--",
            //                        Over_Time = Get_Total_OverTime != "00:00" ? Get_Total_OverTime : "--:--"
            //                    });
            //                }
            //            }

            //            int TotalHours = 0;
            //            int TotalMinutes = 0;
            //            int TotalHours_Delay = 0;
            //            int TotalMinutes_Delay = 0;
            //            int TotalHours_Over = 0;
            //            int TotalMinutes_Over = 0;

            //            for (int i = 0; i < EmployeeList.Count; i++)
            //            {
            //                Code = EmployeeList[i].Code;

            //                if (context.Employees.Any(x => x.Code == Code))
            //                {
            //                    var TotalTimeEmp = EmployeeAttendanceList.Where(x => x.EmployeeCode == Code.ToString() && x.Total_Time != "--:--").ToList();

            //                    TotalHours = 0;
            //                    TotalMinutes = 0;
            //                    TotalHours_Delay = 0;
            //                    TotalMinutes_Delay = 0;
            //                    TotalHours_Over = 0;
            //                    TotalMinutes_Over = 0;

            //                    for (int j = 0; j < TotalTimeEmp.Count; j++)
            //                    {
            //                        TotalHours += Int32.Parse(TotalTimeEmp[j].Total_Time.Split(':')[0]);
            //                        TotalMinutes += Int32.Parse(TotalTimeEmp[j].Total_Time.Split(':')[1]);
            //                        TotalHours_Delay += TotalTimeEmp[j].Delay_Time.Split(':')[0] != "--" ? Int32.Parse(TotalTimeEmp[j].Delay_Time.Split(':')[0]) : 0;
            //                        TotalMinutes_Delay += TotalTimeEmp[j].Delay_Time.Split(':')[1] != "--" ? Int32.Parse(TotalTimeEmp[j].Delay_Time.Split(':')[1]) : 0;
            //                        TotalHours_Over += TotalTimeEmp[j].Over_Time.Split(':')[0] != "--" ? Int32.Parse(TotalTimeEmp[j].Over_Time.Split(':')[0]) : 0;
            //                        TotalMinutes_Over += TotalTimeEmp[j].Over_Time.Split(':')[1] != "--" ? Int32.Parse(TotalTimeEmp[j].Over_Time.Split(':')[1]) : 0;

            //                        if (TotalMinutes >= 60)
            //                        {
            //                            TotalMinutes -= 60;
            //                            TotalHours++;
            //                        }

            //                        if (TotalMinutes_Delay >= 60)
            //                        {
            //                            TotalMinutes_Delay -= 60;
            //                            TotalHours_Delay++;
            //                        }

            //                        if (TotalMinutes_Over >= 60)
            //                        {
            //                            TotalMinutes_Over -= 60;
            //                            TotalHours_Over++;
            //                        }
            //                    }

            //                    EmployeeAttendanceList.Add(new EmployeeAttendance
            //                    {
            //                        SN = EmployeeAttendanceList.Count + 1,
            //                        EmployeeID = EmployeeList[i].EmployeeID,
            //                        AttendanceDate = ToDate.Date,
            //                        AttendanceDay = "",
            //                        EmployeeCode = EmployeeList[i].Code.ToString(),
            //                        EmployeeName = EmployeeList[i].FirstNameEN + " " + EmployeeList[i].FatherNameEN,
            //                        First_TimeIn = "",
            //                        First_TimeOut = "",
            //                        Second_TimeIn = "",
            //                        Second_TimeOut = "Total",
            //                        Total_Time = TotalHours.ToString() + ":" + TotalMinutes.ToString(),
            //                        Delay_Time = TotalHours_Delay.ToString() + ":" + TotalMinutes_Delay.ToString(),
            //                        Over_Time = TotalHours_Over.ToString() + ":" + TotalMinutes_Over.ToString()
            //                    });
            //                }
            //            }

            //            EmployeeAttendanceList = EmployeeAttendanceList.OrderBy(x => x.EmployeeCode).ThenBy(x => x.AttendanceDate).ToList();

            //            dgv_Attendance.DataSource = EmployeeAttendanceList.ToList();
            //            dgv_Attendance.DataBind();

            //            #endregion
            //        }
            //        else
            //        {
            //            #region Attendance Monthly

            //            dgv_Attendance.Visible = false;
            //            dgv_AttendanceMonthly.Visible = true;
            //            int Count = 4;
            //            int Total_P = 0;
            //            int Total_O = 0;
            //            int Total_A = 0;
            //            int Total_S = 0;
            //            int Total_E = 0;

            //            DataTable dt = new DataTable();

            //            List<DateTime> FingerPrintList = new List<DateTime>();

            //            DateTime FromDateShifts = FromDate.AddDays(-7).Date.Date;
            //            var LoadFingerPrintList = context.AttedanceDayOffs.Where(x => x.WeekStartDate >= FromDateShifts && x.WeekStartDate <= ToDate).OrderBy(x => x.WeekStartDate).ToList();

            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("SN") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "SN";
            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("EmployeeID") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "EmployeeID";
            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("Code") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "Code";
            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("Name") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "Name";

            //            for (DateTime CurrentDay = FromDate.Date; CurrentDay.Date < ToDate.Date; CurrentDay = CurrentDay.AddDays(1))
            //            {
            //                dt.Columns.AddRange(new DataColumn[1] { new DataColumn(CurrentDay.Date.Day.ToString()) });
            //                dt.Columns[dt.Columns.Count - 1].Caption = CurrentDay.Date.Day.ToString();
            //            }

            //            int EmptyCount = 1;

            //            for (int j = dt.Columns.Count; j < 35; j++)
            //            {
            //                dt.Columns.AddRange(new DataColumn[1] { new DataColumn("E" + EmptyCount.ToString()) });
            //                dt.Columns[dt.Columns.Count - 1].Caption = "E" + EmptyCount.ToString();
            //                EmptyCount++;
            //            }

            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("P") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "P";
            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("O") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "O";
            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("A") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "A";
            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("S") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "S";
            //            dt.Columns.AddRange(new DataColumn[1] { new DataColumn("E") });
            //            dt.Columns[dt.Columns.Count - 1].Caption = "E";

            //            DataRow datarow1 = dt.NewRow();

            //            datarow1[0] = "";
            //            datarow1[1] = "";
            //            datarow1[2] = "";
            //            datarow1[3] = "";

            //            Count = 4;

            //            for (DateTime CurrentDay = FromDate.Date; CurrentDay.Date < ToDate.Date; CurrentDay = CurrentDay.AddDays(1))
            //            {
            //                switch (CurrentDay.Date.DayOfWeek)
            //                {
            //                    case DayOfWeek.Saturday:

            //                        datarow1[Count] = "Sat";

            //                        break;

            //                    case DayOfWeek.Sunday:

            //                        datarow1[Count] = "Sun";

            //                        break;

            //                    case DayOfWeek.Monday:

            //                        datarow1[Count] = "Mon";

            //                        break;

            //                    case DayOfWeek.Tuesday:

            //                        datarow1[Count] = "Tue";

            //                        break;

            //                    case DayOfWeek.Wednesday:

            //                        datarow1[Count] = "Wed";

            //                        break;

            //                    case DayOfWeek.Thursday:

            //                        datarow1[Count] = "Thu";

            //                        break;

            //                    case DayOfWeek.Friday:

            //                        datarow1[Count] = "Fri";

            //                        break;
            //                }

            //                Count++;
            //            }

            //            datarow1[Count] = "";
            //            Count++;
            //            datarow1[Count] = "";
            //            Count++;
            //            datarow1[Count] = "";
            //            Count++;
            //            datarow1[Count] = "";
            //            Count++;
            //            datarow1[Count] = "";

            //            dt.Rows.Add(datarow1);

            //            int EmployeeID = 0;
            //            int Shifts_Counter = 0;

            //            for (int i = 0; i < EmployeeList.Count; i++)
            //            {
            //                DataRow datarow = dt.NewRow();

            //                Code = EmployeeList[i].Code;
            //                EmployeeID = context.Employees.Single(x => x.Code == Code).EmployeeID;

            //                BadgeNumber = "";

            //                for (int j = 0; j < (9 - EmployeeList[i].Code.ToString().Length); j++)
            //                {
            //                    BadgeNumber += "0";
            //                }

            //                BadgeNumber += EmployeeList[i].Code.ToString();

            //                datarow[0] = dt.Rows.Count.ToString();
            //                datarow[1] = EmployeeList[i].EmployeeID.ToString();
            //                datarow[2] = EmployeeList[i].Code.ToString();
            //                datarow[3] = context.Employees.Single(x => x.Code == Code).FirstNameEN + " " + context.Employees.Single(x => x.Code == Code).FatherNameEN;

            //                Count = 4;
            //                Total_P = 0;
            //                Total_O = 0;
            //                Total_A = 0;
            //                Total_S = 0;
            //                Total_E = 0;

            //                for (DateTime CurrentDay = FromDate.Date; CurrentDay.Date < ToDate.Date; CurrentDay = CurrentDay.AddDays(1))
            //                {
            //                    FingerPrintList.Clear();
            //                    int DaysUntilSaturday = ((int)DayOfWeek.Saturday - (int)CurrentDay.Date.DayOfWeek - 7) % 7;
            //                    DateTime CurrentSaturday = CurrentDay.Date.AddDays(DaysUntilSaturday).Date.Date;

            //                    var EmployeeAttendance = AttendanceAllBranches_List.Where(x => x.BadgeNumber == BadgeNumber && x.CheckTime.Date.Date == CurrentDay.Date.Date).OrderBy(x => x.CheckTime).ToList();

            //                    for (int j = 0; j < EmployeeAttendance.Count; j++)
            //                    {
            //                        if (EmployeeAttendance[j].CheckTime.ToShortTimeString().Split(' ')[1] == "AM")
            //                        {
            //                            if (EmployeeAttendance[j].CheckTime.Hour >= 5)
            //                            {
            //                                if (FingerPrintList.Count != 0)
            //                                {
            //                                    if (FingerPrintList[FingerPrintList.Count - 1].Hour != EmployeeAttendance[j].CheckTime.Hour ||
            //                                        FingerPrintList[FingerPrintList.Count - 1].Minute != EmployeeAttendance[j].CheckTime.Minute ||
            //                                        FingerPrintList[FingerPrintList.Count - 1].ToShortTimeString().Split(' ')[1] != EmployeeAttendance[j].CheckTime.ToShortTimeString().Split(' ')[1])
            //                                    {
            //                                        if (FingerPrintList.Count == 4)
            //                                        {
            //                                            FingerPrintList[FingerPrintList.Count - 1] = EmployeeAttendance[j].CheckTime;
            //                                        }
            //                                        else if (FingerPrintList[FingerPrintList.Count - 1].AddMinutes(10) < EmployeeAttendance[j].CheckTime)
            //                                        {
            //                                            FingerPrintList.Add(EmployeeAttendance[j].CheckTime);
            //                                        }
            //                                    }
            //                                }
            //                                else
            //                                {
            //                                    FingerPrintList.Add(EmployeeAttendance[j].CheckTime);
            //                                }
            //                            }
            //                        }
            //                        else
            //                        {
            //                            if (FingerPrintList.Count != 0)
            //                            {
            //                                if (FingerPrintList[FingerPrintList.Count - 1].Hour != EmployeeAttendance[j].CheckTime.Hour ||
            //                                    FingerPrintList[FingerPrintList.Count - 1].Minute != EmployeeAttendance[j].CheckTime.Minute ||
            //                                    FingerPrintList[FingerPrintList.Count - 1].ToShortTimeString().Split(' ')[1] != EmployeeAttendance[j].CheckTime.ToShortTimeString().Split(' ')[1])
            //                                {
            //                                    if (FingerPrintList.Count == 4)
            //                                    {
            //                                        FingerPrintList[FingerPrintList.Count - 1] = EmployeeAttendance[j].CheckTime;
            //                                    }
            //                                    else if (FingerPrintList[FingerPrintList.Count - 1].AddMinutes(10) < EmployeeAttendance[j].CheckTime)
            //                                    {
            //                                        FingerPrintList.Add(EmployeeAttendance[j].CheckTime);
            //                                    }
            //                                }
            //                            }
            //                            else
            //                            {
            //                                FingerPrintList.Add(EmployeeAttendance[j].CheckTime);
            //                            }
            //                        }
            //                    }

            //                    if (EmployeeAttendance.Count != 0)
            //                    {
            //                        var EmployeeAttendanceNextDay = AttendanceAllBranches_List.Where(x => x.BadgeNumber == BadgeNumber && x.CheckTime.Date.Date == CurrentDay.AddDays(1)).OrderBy(x => x.CheckTime).ToList();

            //                        for (int j = 0; j < EmployeeAttendanceNextDay.Count; j++)
            //                        {
            //                            if (EmployeeAttendanceNextDay[j].CheckTime.ToShortTimeString().Split(' ')[1] == "AM")
            //                            {
            //                                if (EmployeeAttendanceNextDay[j].CheckTime.Hour <= 5)
            //                                {
            //                                    if (FingerPrintList.Count != 0)
            //                                    {
            //                                        if (FingerPrintList[FingerPrintList.Count - 1].Hour != EmployeeAttendanceNextDay[j].CheckTime.Hour ||
            //                                            FingerPrintList[FingerPrintList.Count - 1].Minute != EmployeeAttendanceNextDay[j].CheckTime.Minute ||
            //                                            FingerPrintList[FingerPrintList.Count - 1].ToShortTimeString().Split(' ')[1] != EmployeeAttendanceNextDay[j].CheckTime.ToShortTimeString().Split(' ')[1])
            //                                        {
            //                                            if (FingerPrintList.Count == 4)
            //                                            {
            //                                                FingerPrintList[FingerPrintList.Count - 1] = (EmployeeAttendanceNextDay[j].CheckTime);
            //                                            }
            //                                            else if (FingerPrintList[FingerPrintList.Count - 1].AddMinutes(10) < EmployeeAttendanceNextDay[j].CheckTime)
            //                                            {
            //                                                FingerPrintList.Add(EmployeeAttendanceNextDay[j].CheckTime);
            //                                            }
            //                                        }
            //                                    }
            //                                    else
            //                                    {
            //                                        FingerPrintList.Add(EmployeeAttendanceNextDay[j].CheckTime);
            //                                    }

            //                                }
            //                            }
            //                        }
            //                    }

            //                    Shifts_Counter = 0;

            //                    if (LoadFingerPrintList.Any(x => x.EmployeeID == EmployeeID && x.WeekStartDate == CurrentSaturday))
            //                    {
            //                        var LoadWeekFingerPrintList = LoadFingerPrintList.Single(x => x.EmployeeID == EmployeeID && x.WeekStartDate == CurrentSaturday);

            //                        if (LoadWeekFingerPrintList.WeekStartDate == CurrentDay) // Saturday
            //                        {
            //                            #region Saturday

            //                            if (LoadWeekFingerPrintList.Saturday_Shift_1 == "0" &&
            //                                LoadWeekFingerPrintList.Saturday_Shift_2 == "0" &&
            //                                LoadWeekFingerPrintList.Saturday_Shift_3 == "0" &&
            //                                LoadWeekFingerPrintList.Saturday_Shift_4 == "0")
            //                            {
            //                                datarow[Count] = "O";
            //                                Total_O++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Saturday_Shift_1 == "49" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_2 == "49" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_3 == "49" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_4 == "49")
            //                            {
            //                                datarow[Count] = "S";
            //                                Total_S++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Saturday_Shift_1 == "50" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_2 == "50" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_3 == "50" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_4 == "50")
            //                            {
            //                                datarow[Count] = "E";
            //                                Total_E++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Saturday_Shift_1 == "51" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_2 == "51" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_3 == "51" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_4 == "51")
            //                            {
            //                                datarow[Count] = "C";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Saturday_Shift_1 == "52" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_2 == "52" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_3 == "52" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_4 == "52")
            //                            {
            //                                datarow[Count] = "D";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Saturday_Shift_1 == "53" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_2 == "53" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_3 == "53" &&
            //                                     LoadWeekFingerPrintList.Saturday_Shift_4 == "53")
            //                            {
            //                                datarow[Count] = "N";
            //                                Total_P++;
            //                            }
            //                            else
            //                            {
            //                                if (LoadWeekFingerPrintList.Saturday_Shift_1 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Saturday_Shift_1) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Saturday_Shift_1) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Saturday_Shift_2 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Saturday_Shift_2) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Saturday_Shift_2) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Saturday_Shift_3 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Saturday_Shift_3) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Saturday_Shift_3) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Saturday_Shift_4 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Saturday_Shift_4) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Saturday_Shift_4) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }

            //                                if (FingerPrintList.Count >= Shifts_Counter &&
            //                                    Shifts_Counter != 0 &&
            //                                    FingerPrintList.Count >= 2) // Shifts Accepted
            //                                {
            //                                    datarow[Count] = "P";
            //                                    Total_P++;
            //                                }
            //                                else // Absent
            //                                {
            //                                    datarow[Count] = "A";
            //                                    Total_A++;
            //                                }
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(1) == CurrentDay) // Sunday
            //                        {
            //                            #region Sunday

            //                            if (LoadWeekFingerPrintList.Sunday_Shift_1 == "0" &&
            //                                LoadWeekFingerPrintList.Sunday_Shift_2 == "0" &&
            //                                LoadWeekFingerPrintList.Sunday_Shift_3 == "0" &&
            //                                LoadWeekFingerPrintList.Sunday_Shift_4 == "0")
            //                            {
            //                                datarow[Count] = "O";
            //                                Total_O++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Sunday_Shift_1 == "49" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_2 == "49" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_3 == "49" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_4 == "49")
            //                            {
            //                                datarow[Count] = "S";
            //                                Total_S++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Sunday_Shift_1 == "50" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_2 == "50" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_3 == "50" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_4 == "50")
            //                            {
            //                                datarow[Count] = "E";
            //                                Total_E++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Sunday_Shift_1 == "51" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_2 == "51" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_3 == "51" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_4 == "51")
            //                            {
            //                                datarow[Count] = "C";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Sunday_Shift_1 == "52" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_2 == "52" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_3 == "52" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_4 == "52")
            //                            {
            //                                datarow[Count] = "D";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Sunday_Shift_1 == "53" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_2 == "53" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_3 == "53" &&
            //                                     LoadWeekFingerPrintList.Sunday_Shift_4 == "53")
            //                            {
            //                                datarow[Count] = "N";
            //                                Total_P++;
            //                            }
            //                            else
            //                            {
            //                                if (LoadWeekFingerPrintList.Sunday_Shift_1 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Sunday_Shift_1) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Sunday_Shift_1) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Sunday_Shift_2 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Sunday_Shift_2) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Sunday_Shift_2) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Sunday_Shift_3 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Sunday_Shift_3) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Sunday_Shift_3) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Sunday_Shift_4 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Sunday_Shift_4) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Sunday_Shift_4) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }

            //                                if (FingerPrintList.Count >= Shifts_Counter &&
            //                                    Shifts_Counter != 0 &&
            //                                    FingerPrintList.Count >= 2) // Shifts Accepted
            //                                {
            //                                    datarow[Count] = "P";
            //                                    Total_P++;
            //                                }
            //                                else // Absent
            //                                {
            //                                    datarow[Count] = "A";
            //                                    Total_A++;
            //                                }
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(2) == CurrentDay) // Monday
            //                        {
            //                            #region Monday

            //                            if (LoadWeekFingerPrintList.Monday_Shift_1 == "0" &&
            //                                 LoadWeekFingerPrintList.Monday_Shift_2 == "0" &&
            //                                 LoadWeekFingerPrintList.Monday_Shift_3 == "0" &&
            //                                 LoadWeekFingerPrintList.Monday_Shift_4 == "0")
            //                            {
            //                                datarow[Count] = "O";
            //                                Total_O++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Monday_Shift_1 == "49" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_2 == "49" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_3 == "49" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_4 == "49")
            //                            {
            //                                datarow[Count] = "S";
            //                                Total_S++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Monday_Shift_1 == "50" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_2 == "50" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_3 == "50" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_4 == "50")
            //                            {
            //                                datarow[Count] = "E";
            //                                Total_E++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Monday_Shift_1 == "51" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_2 == "51" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_3 == "51" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_4 == "51")
            //                            {
            //                                datarow[Count] = "C";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Monday_Shift_1 == "52" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_2 == "52" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_3 == "52" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_4 == "52")
            //                            {
            //                                datarow[Count] = "D";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Monday_Shift_1 == "53" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_2 == "53" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_3 == "53" &&
            //                                     LoadWeekFingerPrintList.Monday_Shift_4 == "53")
            //                            {
            //                                datarow[Count] = "N";
            //                                Total_P++;
            //                            }
            //                            else
            //                            {
            //                                if (LoadWeekFingerPrintList.Monday_Shift_1 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Monday_Shift_1) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Monday_Shift_1) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Monday_Shift_2 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Monday_Shift_2) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Monday_Shift_2) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Monday_Shift_3 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Monday_Shift_3) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Monday_Shift_3) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Monday_Shift_4 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Monday_Shift_4) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Monday_Shift_4) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }

            //                                if (FingerPrintList.Count >= Shifts_Counter &&
            //                                    Shifts_Counter != 0 &&
            //                                    FingerPrintList.Count >= 2) // Shifts Accepted
            //                                {
            //                                    datarow[Count] = "P";
            //                                    Total_P++;
            //                                }
            //                                else // Absent
            //                                {
            //                                    datarow[Count] = "A";
            //                                    Total_A++;
            //                                }
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(3) == CurrentDay) // Tuesday
            //                        {
            //                            #region Tuesday

            //                            if (LoadWeekFingerPrintList.Tuesday_Shift_1 == "0" &&
            //                                LoadWeekFingerPrintList.Tuesday_Shift_2 == "0" &&
            //                                LoadWeekFingerPrintList.Tuesday_Shift_3 == "0" &&
            //                                LoadWeekFingerPrintList.Tuesday_Shift_4 == "0")
            //                            {
            //                                datarow[Count] = "O";
            //                                Total_O++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Tuesday_Shift_1 == "49" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_2 == "49" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_3 == "49" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_4 == "49")
            //                            {
            //                                datarow[Count] = "S";
            //                                Total_S++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Tuesday_Shift_1 == "50" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_2 == "50" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_3 == "50" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_4 == "50")
            //                            {
            //                                datarow[Count] = "E";
            //                                Total_E++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Tuesday_Shift_1 == "51" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_2 == "51" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_3 == "51" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_4 == "51")
            //                            {
            //                                datarow[Count] = "C";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Tuesday_Shift_1 == "52" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_2 == "52" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_3 == "52" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_4 == "52")
            //                            {
            //                                datarow[Count] = "D";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Tuesday_Shift_1 == "53" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_2 == "53" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_3 == "53" &&
            //                                     LoadWeekFingerPrintList.Tuesday_Shift_4 == "53")
            //                            {
            //                                datarow[Count] = "N";
            //                                Total_P++;
            //                            }
            //                            else
            //                            {
            //                                if (LoadWeekFingerPrintList.Tuesday_Shift_1 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Tuesday_Shift_1) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Tuesday_Shift_1) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Tuesday_Shift_2 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Tuesday_Shift_2) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Tuesday_Shift_2) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Tuesday_Shift_3 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Tuesday_Shift_3) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Tuesday_Shift_3) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Tuesday_Shift_4 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Tuesday_Shift_4) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Tuesday_Shift_4) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }

            //                                if (FingerPrintList.Count >= Shifts_Counter &&
            //                                    Shifts_Counter != 0 &&
            //                                    FingerPrintList.Count >= 2) // Shifts Accepted
            //                                {
            //                                    datarow[Count] = "P";
            //                                    Total_P++;
            //                                }
            //                                else // Absent
            //                                {
            //                                    datarow[Count] = "A";
            //                                    Total_A++;
            //                                }
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(4) == CurrentDay) // Wednesday
            //                        {
            //                            #region Wednesday

            //                            if (LoadWeekFingerPrintList.Wednesday_Shift_1 == "0" &&
            //                                LoadWeekFingerPrintList.Wednesday_Shift_2 == "0" &&
            //                                LoadWeekFingerPrintList.Wednesday_Shift_3 == "0" &&
            //                                LoadWeekFingerPrintList.Wednesday_Shift_4 == "0")
            //                            {
            //                                datarow[Count] = "O";
            //                                Total_O++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Wednesday_Shift_1 == "49" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_2 == "49" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_3 == "49" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_4 == "49")
            //                            {
            //                                datarow[Count] = "S";
            //                                Total_S++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Wednesday_Shift_1 == "50" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_2 == "50" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_3 == "50" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_4 == "50")
            //                            {
            //                                datarow[Count] = "E";
            //                                Total_E++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Wednesday_Shift_1 == "51" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_2 == "51" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_3 == "51" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_4 == "51")
            //                            {
            //                                datarow[Count] = "C";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Wednesday_Shift_1 == "52" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_2 == "52" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_3 == "52" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_4 == "52")
            //                            {
            //                                datarow[Count] = "D";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Wednesday_Shift_1 == "53" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_2 == "53" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_3 == "53" &&
            //                                     LoadWeekFingerPrintList.Wednesday_Shift_4 == "53")
            //                            {
            //                                datarow[Count] = "N";
            //                                Total_P++;
            //                            }
            //                            else
            //                            {
            //                                if (LoadWeekFingerPrintList.Wednesday_Shift_1 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Wednesday_Shift_1) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Wednesday_Shift_1) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Wednesday_Shift_2 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Wednesday_Shift_2) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Wednesday_Shift_2) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Wednesday_Shift_3 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Wednesday_Shift_3) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Wednesday_Shift_3) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Wednesday_Shift_4 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Wednesday_Shift_4) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Wednesday_Shift_4) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }

            //                                if (FingerPrintList.Count >= Shifts_Counter &&
            //                                    Shifts_Counter != 0 &&
            //                                    FingerPrintList.Count >= 2) // Shifts Accepted
            //                                {
            //                                    datarow[Count] = "P";
            //                                    Total_P++;
            //                                }
            //                                else // Absent
            //                                {
            //                                    datarow[Count] = "A";
            //                                    Total_A++;
            //                                }
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(5) == CurrentDay) // Thursday
            //                        {
            //                            #region Thursday

            //                            if (LoadWeekFingerPrintList.Thursday_Shift_1 == "0" &&
            //                                LoadWeekFingerPrintList.Thursday_Shift_2 == "0" &&
            //                                LoadWeekFingerPrintList.Thursday_Shift_3 == "0" &&
            //                                LoadWeekFingerPrintList.Thursday_Shift_4 == "0")
            //                            {
            //                                datarow[Count] = "O";
            //                                Total_O++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Thursday_Shift_1 == "49" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_2 == "49" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_3 == "49" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_4 == "49")
            //                            {
            //                                datarow[Count] = "S";
            //                                Total_S++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Thursday_Shift_1 == "50" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_2 == "50" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_3 == "50" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_4 == "50")
            //                            {
            //                                datarow[Count] = "E";
            //                                Total_E++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Thursday_Shift_1 == "51" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_2 == "51" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_3 == "51" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_4 == "51")
            //                            {
            //                                datarow[Count] = "C";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Thursday_Shift_1 == "52" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_2 == "52" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_3 == "52" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_4 == "52")
            //                            {
            //                                datarow[Count] = "D";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Thursday_Shift_1 == "53" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_2 == "53" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_3 == "53" &&
            //                                     LoadWeekFingerPrintList.Thursday_Shift_4 == "53")
            //                            {
            //                                datarow[Count] = "N";
            //                                Total_P++;
            //                            }
            //                            else
            //                            {
            //                                if (LoadWeekFingerPrintList.Thursday_Shift_1 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Thursday_Shift_1) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Thursday_Shift_1) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Thursday_Shift_2 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Thursday_Shift_2) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Thursday_Shift_2) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Thursday_Shift_3 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Thursday_Shift_3) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Thursday_Shift_3) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Thursday_Shift_4 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Thursday_Shift_4) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Thursday_Shift_4) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }

            //                                if (FingerPrintList.Count >= Shifts_Counter &&
            //                                    Shifts_Counter != 0 &&
            //                                    FingerPrintList.Count >= 2) // Shifts Accepted
            //                                {
            //                                    datarow[Count] = "P";
            //                                    Total_P++;
            //                                }
            //                                else // Absent
            //                                {
            //                                    datarow[Count] = "A";
            //                                    Total_A++;
            //                                }
            //                            }

            //                            #endregion
            //                        }
            //                        else if (LoadWeekFingerPrintList.WeekStartDate.AddDays(6) == CurrentDay) // Friday
            //                        {
            //                            #region Friday

            //                            if (LoadWeekFingerPrintList.Friday_Shift_1 == "0" &&
            //                                LoadWeekFingerPrintList.Friday_Shift_2 == "0" &&
            //                                LoadWeekFingerPrintList.Friday_Shift_3 == "0" &&
            //                                LoadWeekFingerPrintList.Friday_Shift_4 == "0")
            //                            {
            //                                datarow[Count] = "O";
            //                                Total_O++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Friday_Shift_1 == "49" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_2 == "49" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_3 == "49" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_4 == "49")
            //                            {
            //                                datarow[Count] = "S";
            //                                Total_S++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Friday_Shift_1 == "50" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_2 == "50" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_3 == "50" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_4 == "50")
            //                            {
            //                                datarow[Count] = "E";
            //                                Total_E++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Friday_Shift_1 == "51" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_2 == "51" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_3 == "51" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_4 == "51")
            //                            {
            //                                datarow[Count] = "C";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Friday_Shift_1 == "52" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_2 == "52" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_3 == "52" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_4 == "52")
            //                            {
            //                                datarow[Count] = "D";
            //                                Total_P++;
            //                            }
            //                            else if (LoadWeekFingerPrintList.Friday_Shift_1 == "53" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_2 == "53" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_3 == "53" &&
            //                                     LoadWeekFingerPrintList.Friday_Shift_4 == "53")
            //                            {
            //                                datarow[Count] = "N";
            //                                Total_P++;
            //                            }
            //                            else
            //                            {
            //                                if (LoadWeekFingerPrintList.Friday_Shift_1 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Friday_Shift_1) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Friday_Shift_1) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Friday_Shift_2 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Friday_Shift_2) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Friday_Shift_2) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Friday_Shift_3 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Friday_Shift_3) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Friday_Shift_3) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }
            //                                if (LoadWeekFingerPrintList.Friday_Shift_4 != "")
            //                                {
            //                                    if (Int32.Parse(LoadWeekFingerPrintList.Friday_Shift_4) >= 1 && Int32.Parse(LoadWeekFingerPrintList.Friday_Shift_4) <= 48)
            //                                    {
            //                                        Shifts_Counter++;
            //                                    }
            //                                }

            //                                if (FingerPrintList.Count >= Shifts_Counter &&
            //                                    Shifts_Counter != 0 &&
            //                                    FingerPrintList.Count >= 2) // Shifts Accepted
            //                                {
            //                                    datarow[Count] = "P";
            //                                    Total_P++;
            //                                }
            //                                else // Absent
            //                                {
            //                                    datarow[Count] = "A";
            //                                    Total_A++;
            //                                }
            //                            }

            //                            #endregion
            //                        }
            //                    }
            //                    else // Absent
            //                    {
            //                        datarow[Count] = "A";
            //                        Total_A++;
            //                    }

            //                    Count++;
            //                }

            //                for (int j = Count; j < 35; j++)
            //                {
            //                    datarow[j] = "";
            //                    Count++;
            //                }

            //                datarow[Count] = Total_P;
            //                Count++;
            //                datarow[Count] = Total_O;
            //                Count++;
            //                datarow[Count] = Total_A;
            //                Count++;
            //                datarow[Count] = Total_S;
            //                Count++;
            //                datarow[Count] = Total_E;

            //                dt.Rows.Add(datarow);
            //            }

            //            dgv_AttendanceMonthly.DataSource = null;
            //            dgv_AttendanceMonthly.DataSource = dt;
            //            dgv_AttendanceMonthly.DataBind();

            //            dgv_SalaryDeduction.DataBind();

            //            dgv_AttendanceMonthly.Columns["SN"].Width = new System.Web.UI.WebControls.Unit(30);
            //            dgv_AttendanceMonthly.Columns["Code"].Width = new System.Web.UI.WebControls.Unit(60);
            //            dgv_AttendanceMonthly.Columns["Name"].Width = new System.Web.UI.WebControls.Unit(200);

            //            dgv_AttendanceMonthly.Columns["SN"].Caption = "SN";
            //            dgv_AttendanceMonthly.Columns["Code"].Caption = "Code";
            //            dgv_AttendanceMonthly.Columns["Name"].Caption = "Name";

            //            dgv_AttendanceMonthly.Columns["EmployeeID"].Visible = false;

            //            Count = 4;

            //            for (DateTime CurrentDay = FromDate.Date; CurrentDay.Date < ToDate.Date; CurrentDay = CurrentDay.AddDays(1))
            //            {
            //                dgv_AttendanceMonthly.Columns[Count].Caption = CurrentDay.Date.Day.ToString();
            //                Count++;
            //            }

            //            dgv_AttendanceMonthly.Columns[dgv_AttendanceMonthly.Columns.Count - 5].Caption = "P";
            //            dgv_AttendanceMonthly.Columns[dgv_AttendanceMonthly.Columns.Count - 4].Caption = "O";
            //            dgv_AttendanceMonthly.Columns[dgv_AttendanceMonthly.Columns.Count - 3].Caption = "A";
            //            dgv_AttendanceMonthly.Columns[dgv_AttendanceMonthly.Columns.Count - 2].Caption = "S";
            //            dgv_AttendanceMonthly.Columns[dgv_AttendanceMonthly.Columns.Count - 1].Caption = "E";

            //            DataSets.PrintDataSet ds = new DataSets.PrintDataSet();

            //            for (int i = 0; i < dt.Rows.Count; i++)
            //            {
            //                if (i == 1)
            //                {
            //                    ds.Attendance_Report_Monthly.AddAttendance_Report_MonthlyRow("SN",
            //                                                                             "Code",
            //                                                                             "Name",
            //                                                                             dt.Columns[4].Caption,
            //                                                                             dt.Columns[5].Caption,
            //                                                                             dt.Columns[6].Caption,
            //                                                                             dt.Columns[7].Caption,
            //                                                                             dt.Columns[8].Caption,
            //                                                                             dt.Columns[9].Caption,
            //                                                                             dt.Columns[10].Caption,
            //                                                                             dt.Columns[11].Caption,
            //                                                                             dt.Columns[12].Caption,
            //                                                                             dt.Columns[13].Caption,
            //                                                                             dt.Columns[14].Caption,
            //                                                                             dt.Columns[15].Caption,
            //                                                                             dt.Columns[16].Caption,
            //                                                                             dt.Columns[17].Caption,
            //                                                                             dt.Columns[18].Caption,
            //                                                                             dt.Columns[19].Caption,
            //                                                                             dt.Columns[20].Caption,
            //                                                                             dt.Columns[21].Caption,
            //                                                                             dt.Columns[22].Caption,
            //                                                                             dt.Columns[23].Caption,
            //                                                                             dt.Columns[24].Caption,
            //                                                                             dt.Columns[25].Caption,
            //                                                                             dt.Columns[26].Caption,
            //                                                                             dt.Columns[27].Caption,
            //                                                                             dt.Columns[28].Caption,
            //                                                                             dt.Columns[29].Caption,
            //                                                                             dt.Columns[30].Caption,
            //                                                                             dt.Columns[31].Caption,
            //                                                                             dt.Columns[32].Caption,
            //                                                                             dt.Columns[33].Caption,
            //                                                                             dt.Columns[34].Caption,
            //                                                                             dt.Columns[35].Caption,
            //                                                                             dt.Columns[36].Caption,
            //                                                                             dt.Columns[37].Caption,
            //                                                                             dt.Columns[38].Caption,
            //                                                                             dt.Columns[39].Caption);
            //                }

            //                ds.Attendance_Report_Monthly.AddAttendance_Report_MonthlyRow(dt.Rows[i][0].ToString(),
            //                                                                             dt.Rows[i][2].ToString(),
            //                                                                             dt.Rows[i][3].ToString(),
            //                                                                             dt.Rows[i][4].ToString(),
            //                                                                             dt.Rows[i][5].ToString(),
            //                                                                             dt.Rows[i][6].ToString(),
            //                                                                             dt.Rows[i][7].ToString(),
            //                                                                             dt.Rows[i][8].ToString(),
            //                                                                             dt.Rows[i][9].ToString(),
            //                                                                             dt.Rows[i][10].ToString(),
            //                                                                             dt.Rows[i][11].ToString(),
            //                                                                             dt.Rows[i][12].ToString(),
            //                                                                             dt.Rows[i][13].ToString(),
            //                                                                             dt.Rows[i][14].ToString(),
            //                                                                             dt.Rows[i][15].ToString(),
            //                                                                             dt.Rows[i][16].ToString(),
            //                                                                             dt.Rows[i][17].ToString(),
            //                                                                             dt.Rows[i][18].ToString(),
            //                                                                             dt.Rows[i][19].ToString(),
            //                                                                             dt.Rows[i][20].ToString(),
            //                                                                             dt.Rows[i][21].ToString(),
            //                                                                             dt.Rows[i][22].ToString(),
            //                                                                             dt.Rows[i][23].ToString(),
            //                                                                             dt.Rows[i][24].ToString(),
            //                                                                             dt.Rows[i][25].ToString(),
            //                                                                             dt.Rows[i][26].ToString(),
            //                                                                             dt.Rows[i][27].ToString(),
            //                                                                             dt.Rows[i][28].ToString(),
            //                                                                             dt.Rows[i][29].ToString(),
            //                                                                             dt.Rows[i][30].ToString(),
            //                                                                             dt.Rows[i][31].ToString(),
            //                                                                             dt.Rows[i][32].ToString(),
            //                                                                             dt.Rows[i][33].ToString(),
            //                                                                             dt.Rows[i][34].ToString(),
            //                                                                             dt.Rows[i][35].ToString(),
            //                                                                             dt.Rows[i][36].ToString(),
            //                                                                             dt.Rows[i][37].ToString(),
            //                                                                             dt.Rows[i][38].ToString(),
            //                                                                             dt.Rows[i][39].ToString());
            //            }

            //            Session["AttendanceReport_DataSource"] = ds;

            //            #endregion
            //        }

            //        Load_CMBEmployees();
            //    }


            //return new DataTable();





            //    //var results = (from emp in Context.Employees.ToList()
            //    //               join attendance in Context.Attendance.ToList() on emp.EmployeeId equals attendance.EmployeeID
            //    //               select new
            //    //               {
            //    //                   EmployeeId = emp.EmployeeId,
            //    //                   EmployeeName = emp.FirstNameEN + " " + emp.LastNameEN,
            //    //                   AttendanceID = attendance.AttendanceID,
            //    //                   RequestDate = attendance.RequestDate,
            //    //                   Type = attendance.Type,
            //    //                   FromDate = attendance.FromDate,
            //    //                   ToDate = attendance.ToDate,
            //    //                   NoOfDays = attendance.NoOfDays,
            //    //                   MoneyAmount = attendance.MoneyAmount,
            //    //                   ExecutionDate = attendance.ExecutionDate,
            //    //                   IsActive = attendance.IsActive
            //    //               }).ToList().ToDataTable();
            //    //return results;

            //}

            return new DataTable();
        }

        public bool AddNewAttendance(Attendance model)
        {
            try
            {
                Context.Attendance.Add(new Attendance
                {
                    EmployeeID = model.EmployeeID,
                    ExecutionDate = model.ExecutionDate,
                    FromDate = model.FromDate,
                    ToDate = model.ToDate,
                    RequestDate = model.RequestDate,
                    Type = model.Type,
                    NoOfDays = model.NoOfDays,
                    MoneyAmount = model.MoneyAmount,
                    CreatedDate = DateTime.Now
                });

                Context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public bool EditAttendance(Attendance model)
        {
            try
            {
                var Attendance = Context.Attendance.FirstOrDefault(i => i.AttendanceID == model.AttendanceID);
                if (Attendance != null)
                {
                    Attendance.ExecutionDate = model.ExecutionDate;
                    Attendance.FromDate = model.FromDate;
                    Attendance.ToDate = model.ToDate;
                    Attendance.RequestDate = model.RequestDate;
                    Attendance.Type = model.Type;
                    Attendance.NoOfDays = model.NoOfDays;
                    Attendance.MoneyAmount = model.MoneyAmount;
                    Attendance.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();
                    return true;
                }
                else
                    return false;

            }
            catch (Exception)
            {
                return false;
            }

        }

        public bool DeleteAttendance(int AttendanceId)
        {
            try
            {
                var Attendance = Context.Attendance.FirstOrDefault(i => i.AttendanceID == AttendanceId);
                if (Attendance != null)
                {
                    Context.Remove(Attendance);
                    Context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
            catch (Exception)
            {
                return false;
            }

        }
    }
}
