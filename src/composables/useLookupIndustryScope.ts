import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import {
  normalizeLookupIndustryIds,
  type LookupIndustryFields,
  type LookupIndustrySelection,
} from '@/shared/utils/lookupIndustryScope'

export function useLookupIndustryScope() {
  const user = useUserStore()
  const { t } = useI18n()
  const industryScope = ref<LookupIndustrySelection>({ allIndustries: true, industryIds: [] })
  const getIndustryScope = (): LookupIndustryFields | undefined => {
    if (user.user?.type !== OrganizationTypeEnum.ADMIN) return undefined
    return {
      all_industries: industryScope.value.allIndustries ? 1 : 0,
      industry_ids: industryScope.value.allIndustries
        ? []
        : normalizeLookupIndustryIds(industryScope.value.industryIds),
    }
  }
  const validateIndustryScope = () => {
    const scope = getIndustryScope()
    if (scope?.all_industries === 0 && !scope.industry_ids?.length) {
      new OpenWarningDilaog(t('lookup_excel_industry_required')).openDialog()
      return false
    }
    return true
  }
  return { industryScope, getIndustryScope, validateIndustryScope }
}
