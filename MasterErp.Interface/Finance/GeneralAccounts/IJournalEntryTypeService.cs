using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.GeneralAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Models;

namespace MasterErp.Interface.Finance.GeneralAccounts
{
    public interface IJournalEntryTypeService
    {
        PagedResponseDTO<JournalEntryType> GetJournalEntryTypesData(FilterModel Model);
        ActionsResponseModel CreateNewJournalEntryType(JournalEntryTypeModel Model);
    }
}
