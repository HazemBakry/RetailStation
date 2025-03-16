using MasterErp.Entities.Common;
using MasterErp.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface IAssetsFormService
    {
        DataTable GetAssetsFormData(FilterModel model);
        ActionsResponseModel AddNewAssetsForm(AssetsForm Model);
        ActionsResponseModel EditAssetsForm(AssetsForm Model);
        ActionsResponseModel DeleteAssetsForm(int AssetsFormId);
    }
}
