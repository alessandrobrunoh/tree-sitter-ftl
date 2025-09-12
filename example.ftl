<#import "template.ftl" as layout>
<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <#if messageHeader??>
        ${messageHeader}
        <#else>
        ${message.summary}
        </#if>
    <#elseif section = "form">

        <#--Logica di redirect -->
        <#if message.summary?keep_before(" ") == "accountUpdatedMessage" || message.summary == msg("accountUpdatedMessage")>
            <#-- Controlla se client.baseUrl esiste -->
            <#if (client.baseUrl)?has_content>
                <script type="text/javascript">
                    // Usa il valore di client.baseUrl per il redirect
                    var redirectUrl = "${client.baseUrl}";
                    console.log("Redirecting to: " + redirectUrl); // Log per debug
                    //setTimeout(function() { window.location.href = redirectUrl; }, 1000);
                </script>
                <p>${kcSanitize(msg("accountUpdatedMessage"))?no_esc}</p>
                <p>You will be redirected shortly or <a href="${client.baseUrl}">click here</a>.</p>
            <#else>
                <p>Error: No client base URL configured. Please contact support.</p>
            </#if>
        </#if>

        <div id="kc-info-message">
            <#-- Rimuovi il messaggio duplicato -->
            <#if message.summary?keep_before(" ") != "accountUpdatedMessage">
                <p class="instruction">${message.summary}<#if requiredActions??><#list requiredActions>: <b><#items as reqActionItem>${kcSanitize(msg("requiredAction.${reqActionItem}"))?no_esc}<#sep>, </#items></b></#list><#else></#if></p>
            </#if>
            <#if skipLink??>
            <#else>
                <#if pageRedirectUri?has_content>
                    <p><a href="${pageRedirectUri}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                <#elseif actionUri?has_content>
                    <p><a href="${actionUri}">${kcSanitize(msg("proceedWithAction"))?no_esc}</a></p>
                <#elseif (client.baseUrl)?has_content>
                    <p><a href="${client.baseUrl}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                </#if>
            </#if>
        </div>
    </#if>
</@layout.registrationLayout>
