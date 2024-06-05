import { useToast } from '@/hooks/use-toast';
import { ResponseError } from '@/services/ListService';
import { isError } from '@/lib/utils';

const useErrorSupport = () => {
  const { toast } = useToast();

  const withToastOnError = (action: () => Promise<ResponseError | undefined | any>) => {
    return async () => {
      const result = await action();

      if (result && isError(result)) {
        toast({
          title: result.message
        });
      }
    };
  };

  return {
    withToastOnError
  };
};

export { useErrorSupport };
