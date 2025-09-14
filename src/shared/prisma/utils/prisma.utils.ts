import moment from "moment";

import { QueryParams } from "../interfaces/query.types";

export const getQueryOptions = (
  query: QueryParams,
  insensitiveFields: string[]
) => {
  let options: any = {};
  let pagination: any = {};
  let order: any = {};
  let relations: any = {};
  let relationsFilters: any = {};

  options = parseCaseInsensitive(query, insensitiveFields);
  options = parseDateRange(options);

  pagination = getPagination(options);
  order = getOrder(options);
  relations = getRelations(options);
  relationsFilters = getRelationsFilters(options);

  return {
    where: { ...query, ...relationsFilters },
    ...pagination,
    ...order,
    ...relations,
  };
};

export const parseCaseInsensitive = (
  query: QueryParams,
  insensitiveFields: string[]
) => {
  insensitiveFields.forEach((field) => {
    if (query[field]) {
      query[field] = { contains: query[field], mode: "insensitive" };
    }
  });

  return query;
};

export const parseDateRange = (query: QueryParams) => {
  const createdAt: any = {
    ...(query.from && { gte: moment(query.from).format() }),
    ...(query.to && { lt: moment(query.to).add(1, "days").format() }),
  };

  (createdAt.gte || createdAt.lt) && (query.createdAt = createdAt);

  delete query.from;
  delete query.to;

  return query;
};

export const getOrder = (query: QueryParams) => {
  let order: any = {};
  let orderBy: string = query.orderBy || "asc";

  if (query.orderByField != null) {
    order.orderBy = { [query.orderByField]: orderBy };
  } else {
    order.orderBy = { id: "asc" };
  }

  delete query.orderByField;
  delete query.orderBy;

  return order;
};

export const getPagination = (query: QueryParams) => {
  if (!("limit" in query) && !("page" in query)) {
    return {};
  }

  const take = query.limit ? +query.limit : undefined;
  const skip = query.page && query.limit ? query.page * query.limit : 0;

  delete query.limit;
  delete query.page;

  return { take, skip };
};

export const getRelations = (query: QueryParams) => {
  let include: any = {};

  if (query.relations) {
    Object.keys(query.relations).forEach((relation) => {
      include[relation] = true;
    });
  }

  delete query.relations;

  return include;
};

export const getRelationsFilters = (query: QueryParams) => {
  for (const field in query) {
    if (query.hasOwnProperty(field)) {
      if (field.includes(".")) {
        const [relation, key] = field.split(".");

        query[relation] = {
          is: { [key]: query[field] },
        };

        delete query[field];
      }
    }
  }

  return query;
};
