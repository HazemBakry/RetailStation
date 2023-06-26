using MasterErp.Interface.Finance.GeneralAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.GeneralAccounts
{
    public class AccountTreeService: IAccountTreeService
    {

        public bool SaveNewAccount()
        {

            AccountTree Temp_tbl = new AccountTree();

            if (Session["Status"].ToString() == "Edit")
            {
                List<object> fields = dgv_details.GetSelectedFieldValues(new string[] { "AccountID" });

                if (fields.Count > 0)
                {
                    int account_id = int.Parse(fields[0].ToString());

                    Temp_tbl = Context.AccountTrees.Where(x => x.AccountID == account_id).FirstOrDefault();
                    int old_parent = Temp_tbl.ParentID;

                    Temp_tbl.AccountNumber = txt_AccountNumber.Text;
                    Temp_tbl.ParentID = int.Parse(cmb_Accounts.SelectedItem.Value.ToString());

                    if (old_parent != Temp_tbl.ParentID)
                    {
                        Temp_tbl.AccountNumber = Set_Account_Number(int.Parse(cmb_Accounts.SelectedItem.Value.ToString()));
                    }
                }
            }
            else
            {
                try
                {
                    Temp_tbl.AccountID = (from Data in Context.AccountTrees select Data.AccountID).Max() + 1;
                }
                catch (Exception)
                {
                    Temp_tbl.AccountID = 1;
                }

                Temp_tbl.ParentID = Convert.ToInt32(ASPxTreeList1.FocusedNode.GetValue("AccountID"));
                Temp_tbl.AccountNumber = Set_Account_Number(Convert.ToInt32(ASPxTreeList1.FocusedNode.GetValue("AccountID"))); //long.Parse(txt_AccountNumber.Text);
            }

            Temp_tbl.NameArabic = txt_NameArabic.Text;
            Temp_tbl.NameEnglish = txt_NameEnglish.Text;

            Temp_tbl.IsDisToCostCenter = chk_ISCostCenter.Checked;
            Temp_tbl.FName = "";

            Temp_tbl.IsActive = true;
            Temp_tbl.IsParent = false;
            Temp_tbl.IsLocked = false;
            Temp_tbl.IsPost = chk_IsPost.Checked;

            Temp_tbl.InserDate = DateTime.Now;
            Temp_tbl.InsertUser = 1;
            Temp_tbl.UpdateDate = DateTime.Now;
            Temp_tbl.UpdateUser = 1;
            Temp_tbl.AccountTypeID = int.Parse(cmb_AccountType.SelectedItem.Value.ToString());

            if (cmb_AccountNature.SelectedItem != null)
                Temp_tbl.AccountNature = cmb_AccountNature.SelectedItem.Text;
            else
                Temp_tbl.AccountNature = "بدون";

            if (Temp_tbl.AccountTypeID == 2)            //------------------------------------ حساب أصل ثابت ----------------------------------//
            {
                Temp_tbl.DepreciationID = int.Parse(cmb_DepreciationAccount.SelectedItem.Value.ToString());
                Temp_tbl.AccumulatedDepreciationID = int.Parse(cmb_AccumulatedDepreciationID.SelectedItem.Value.ToString());
                Temp_tbl.DepreciationYears = int.Parse(txt_DepreciationYears.Text);
                Temp_tbl.AssetType = radio_AssetType.SelectedItem.Text;
                Temp_tbl.DepreciationMethod = radio_DepreciationMethod.SelectedItem.Text;
            }

            if (Session["Status"].ToString() != "Edit")
            {
                Context.AccountTrees.Add(Temp_tbl);
            }

            Context.SaveChanges();


            return true;
        }
    }
}
