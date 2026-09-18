import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { ResponseError } from '@/services/ListService';
import { isError } from '@/lib/utils';

const useErrorSupport = () => {
  const { toast } = useToast();
  const t = useTranslations('Errors');

  const withToastOnError = (
    action: () => Promise<ResponseError | undefined | any>
  ) => {
    return async () => {
      const result = await action();

      if (result && isError(result)) {
        toast({
          title: t(result.message as any)
        });
      }
    };
  };

  return {
    withToastOnError
  };
};

export { useErrorSupport };
